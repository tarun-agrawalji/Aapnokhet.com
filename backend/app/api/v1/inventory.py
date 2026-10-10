from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import date, timedelta
from typing import List, Optional
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import (
    Warehouse, Batch, ProductVariant, Product, StockMovement, AuditLog
)
from app.schemas.schemas import InwardBatchRequest, StockAdjustmentRequest

router = APIRouter(prefix="/inventory", tags=["Inventory & FEFO Batches"])

@router.get("/warehouses")
async def list_warehouses(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Warehouse))
    warehouses = res.scalars().all()
    return [
        {
            "id": w.id,
            "name": w.name,
            "address": w.address,
            "city": w.city,
            "state": w.state,
            "pincode": w.pincode,
            "cold_storage_enabled": w.cold_storage_enabled
        }
        for w in warehouses
    ]

@router.get("/batches")
async def list_batches(
    variant_id: Optional[str] = None,
    warehouse_id: Optional[str] = None,
    qc_status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Batch)
        .options(
            selectinload(Batch.variant).selectinload(ProductVariant.product),
            selectinload(Batch.warehouse)
        )
        .order_by(Batch.expiry_date.asc()) # Enforce FEFO order
    )
    if variant_id:
        query = query.where(Batch.variant_id == variant_id)
    if warehouse_id:
        query = query.where(Batch.warehouse_id == warehouse_id)
    if qc_status:
        query = query.where(Batch.qc_status == qc_status)

    res = await db.execute(query)
    batches = res.scalars().all()

    today = date.today()
    return [
        {
            "id": b.id,
            "batch_no": b.batch_no,
            "sku": b.variant.sku if b.variant else "",
            "product_name": b.variant.product.name if (b.variant and b.variant.product) else "",
            "pack_size": b.variant.pack_size if b.variant else "",
            "warehouse": b.warehouse.name if b.warehouse else "",
            "mfg_date": str(b.mfg_date),
            "expiry_date": str(b.expiry_date),
            "days_to_expiry": (b.expiry_date - today).days,
            "is_near_expiry": (b.expiry_date - today).days <= 30,
            "qty_available": b.qty_available,
            "qty_reserved": b.qty_reserved,
            "net_allocatable": max(0, b.qty_available - b.qty_reserved),
            "qc_status": b.qc_status
        }
        for b in batches
    ]

@router.post("/inward")
async def inward_batch(
    req: InwardBatchRequest,
    payload: dict = Depends(require_roles(["Super Admin", "Warehouse Manager"])),
    db: AsyncSession = Depends(get_db)
):
    # Verify variant and warehouse
    variant = await db.get(ProductVariant, req.variant_id)
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found")
    
    warehouse = await db.get(Warehouse, req.warehouse_id)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found")

    batch = Batch(
        variant_id=req.variant_id,
        warehouse_id=req.warehouse_id,
        batch_no=req.batch_no,
        mfg_date=req.mfg_date,
        expiry_date=req.expiry_date,
        qty_available=req.qty,
        qty_reserved=0,
        qc_status=req.qc_status
    )
    db.add(batch)
    await db.flush()

    # Movement record
    movement = StockMovement(
        batch_id=batch.id,
        movement_type="INWARD",
        qty=req.qty,
        reason=f"Goods Inward Note (GRN) - QC {req.qc_status}",
        done_by_user_id=payload.get("sub")
    )
    db.add(movement)

    audit = AuditLog(
        user_id=payload.get("sub"),
        user_email=payload.get("email"),
        action="INWARD_STOCK",
        entity="BATCH",
        entity_id=batch.id,
        after_state={"batch_no": req.batch_no, "qty": req.qty}
    )
    db.add(audit)
    await db.commit()

    return {"message": "Batch inwarded successfully", "batch_id": batch.id, "batch_no": batch.batch_no}

@router.post("/adjust")
async def adjust_stock(
    req: StockAdjustmentRequest,
    payload: dict = Depends(require_roles(["Super Admin", "Warehouse Manager"])),
    db: AsyncSession = Depends(get_db)
):
    batch = await db.get(Batch, req.batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")

    if not req.reason or len(req.reason.strip()) < 5:
        raise HTTPException(status_code=400, detail="Mandatory adjustment reason required (min 5 chars)")

    new_qty = batch.qty_available + req.qty_change
    if new_qty < batch.qty_reserved:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot reduce below currently reserved quantity ({batch.qty_reserved})"
        )

    old_qty = batch.qty_available
    batch.qty_available = new_qty

    movement = StockMovement(
        batch_id=batch.id,
        movement_type="ADJUSTMENT",
        qty=req.qty_change,
        reason=req.reason,
        done_by_user_id=payload.get("sub")
    )
    db.add(movement)

    audit = AuditLog(
        user_id=payload.get("sub"),
        user_email=payload.get("email"),
        action="ADJUST_STOCK",
        entity="BATCH",
        entity_id=batch.id,
        before_state={"qty_available": old_qty},
        after_state={"qty_available": new_qty, "reason": req.reason}
    )
    db.add(audit)
    await db.commit()

    return {
        "message": "Stock adjusted successfully",
        "batch_id": batch.id,
        "old_qty": old_qty,
        "new_qty": new_qty
    }

@router.get("/alerts")
async def get_inventory_alerts(db: AsyncSession = Depends(get_db)):
    today = date.today()
    thirty_days = today + timedelta(days=30)

    # 1. Near Expiry Batches (within 30 days)
    res_expiry = await db.execute(
        select(Batch)
        .where(Batch.expiry_date <= thirty_days, Batch.qty_available > 0)
        .options(selectinload(Batch.variant).selectinload(ProductVariant.product))
    )
    near_expiry = res_expiry.scalars().all()

    # 2. Low Stock Variants (allocatable <= 5 packs)
    res_variants = await db.execute(
        select(ProductVariant)
        .options(selectinload(ProductVariant.batches), selectinload(ProductVariant.product))
    )
    all_variants = res_variants.scalars().all()
    low_stock = []
    for v in all_variants:
        allocatable = sum(
            (b.qty_available - b.qty_reserved)
            for b in v.batches
            if b.qc_status == "PASSED" and (b.qty_available - b.qty_reserved) > 0
        )
        if allocatable <= 5:
            low_stock.append({
                "variant_id": v.id,
                "sku": v.sku,
                "product_name": v.product.name if v.product else "",
                "pack_size": v.pack_size,
                "allocatable": allocatable
            })

    return {
        "near_expiry_count": len(near_expiry),
        "low_stock_count": len(low_stock),
        "near_expiry_batches": [
            {
                "batch_no": b.batch_no,
                "product_name": b.variant.product.name if (b.variant and b.variant.product) else "",
                "sku": b.variant.sku if b.variant else "",
                "expiry_date": str(b.expiry_date),
                "qty_available": b.qty_available
            }
            for b in near_expiry
        ],
        "low_stock_variants": low_stock
    }
