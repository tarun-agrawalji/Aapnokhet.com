from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import Optional, List
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import (
    Category, Product, ProductVariant, PriceSlab, LabReport, Batch, AuditLog
)
from app.schemas.schemas import ProductCreate, BulkPriceUpdateItem

router = APIRouter(prefix="/catalog", tags=["Catalog & Products"])

@router.get("/categories")
async def list_categories(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Category).where(Category.is_active == True).order_by(Category.sort_order))
    categories = res.scalars().all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "slug": c.slug,
            "description": c.description,
            "image_url": c.image_url,
            "is_perishable": c.is_perishable
        }
        for c in categories
    ]

@router.get("/products")
async def list_products(
    category_slug: Optional[str] = None,
    q: Optional[str] = None,
    is_perishable: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    query = (
        select(Product)
        .where(Product.active == True)
        .options(
            selectinload(Product.category),
            selectinload(Product.variants).selectinload(ProductVariant.slabs),
            selectinload(Product.variants).selectinload(ProductVariant.batches),
            selectinload(Product.lab_reports)
        )
    )
    if category_slug:
        query = query.join(Product.category).where(Category.slug == category_slug)
    if is_perishable is not None:
        query = query.where(Product.is_perishable == is_perishable)
    if q:
        query = query.where(
            Product.name.ilike(f"%{q}%") | 
            Product.description.ilike(f"%{q}%") |
            Product.brand.ilike(f"%{q}%")
        )

    res = await db.execute(query)
    products = res.scalars().all()

    result = []
    for p in products:
        # Calculate total available stock across variants
        variants_data = []
        for v in p.variants:
            if not v.active:
                continue
            avail_stock = sum(
                (b.qty_available - b.qty_reserved)
                for b in v.batches
                if b.qc_status == "PASSED" and (b.qty_available - b.qty_reserved) > 0
            )
            variants_data.append({
                "id": v.id,
                "sku": v.sku,
                "pack_size": v.pack_size,
                "unit": v.unit,
                "pack_weight_kg": v.pack_weight_kg,
                "base_price": v.base_price,
                "moq": v.moq,
                "available_stock": avail_stock,
                "in_stock": avail_stock > 0,
                "slabs": [
                    {"min_qty": s.min_qty, "max_qty": s.max_qty, "slab_price": s.slab_price}
                    for s in v.slabs
                ]
            })

        latest_report = p.lab_reports[0] if p.lab_reports else None

        result.append({
            "id": p.id,
            "name": p.name,
            "name_hindi": p.name_hindi,
            "slug": p.slug,
            "category": {"name": p.category.name, "slug": p.category.slug} if p.category else None,
            "brand": p.brand,
            "hsn_code": p.hsn_code,
            "gst_rate": p.gst_rate,
            "origin": p.origin,
            "grade": p.grade,
            "description": p.description,
            "description_hindi": p.description_hindi,
            "storage_tips": p.storage_tips,
            "shelf_life_days": p.shelf_life_days,
            "is_perishable": p.is_perishable,
            "variants": variants_data,
            "purity_certificate": {
                "lab_name": latest_report.lab_name,
                "report_no": latest_report.report_no,
                "report_url": latest_report.report_url,
                "tested_on": str(latest_report.tested_on),
                "parameters": latest_report.parameters,
                "result": latest_report.result
            } if latest_report else None
        })

    return result

@router.get("/products/{slug}")
async def get_product_by_slug(slug: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(Product)
        .where(Product.slug == slug, Product.active == True)
        .options(
            selectinload(Product.category),
            selectinload(Product.variants).selectinload(ProductVariant.slabs),
            selectinload(Product.variants).selectinload(ProductVariant.batches),
            selectinload(Product.lab_reports)
        )
    )
    p = res.scalars().first()
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")

    variants_data = []
    for v in p.variants:
        if not v.active:
            continue
        avail_stock = sum(
            (b.qty_available - b.qty_reserved)
            for b in v.batches
            if b.qc_status == "PASSED" and (b.qty_available - b.qty_reserved) > 0
        )
        variants_data.append({
            "id": v.id,
            "sku": v.sku,
            "pack_size": v.pack_size,
            "unit": v.unit,
            "pack_weight_kg": v.pack_weight_kg,
            "base_price": v.base_price,
            "moq": v.moq,
            "available_stock": avail_stock,
            "in_stock": avail_stock > 0,
            "slabs": [
                {"min_qty": s.min_qty, "max_qty": s.max_qty, "slab_price": s.slab_price}
                for s in v.slabs
            ]
        })

    latest_report = p.lab_reports[0] if p.lab_reports else None

    return {
        "id": p.id,
        "name": p.name,
        "name_hindi": p.name_hindi,
        "slug": p.slug,
        "category": {"name": p.category.name, "slug": p.category.slug} if p.category else None,
        "brand": p.brand,
        "hsn_code": p.hsn_code,
        "gst_rate": p.gst_rate,
        "origin": p.origin,
        "grade": p.grade,
        "description": p.description,
        "description_hindi": p.description_hindi,
        "storage_tips": p.storage_tips,
        "shelf_life_days": p.shelf_life_days,
        "is_perishable": p.is_perishable,
        "variants": variants_data,
        "purity_certificate": {
            "lab_name": latest_report.lab_name,
            "report_no": latest_report.report_no,
            "report_url": latest_report.report_url,
            "tested_on": str(latest_report.tested_on),
            "parameters": latest_report.parameters,
            "result": latest_report.result
        } if latest_report else None
    }

# Admin endpoints: Add Product
@router.post("/products")
async def create_product(
    req: ProductCreate,
    payload: dict = Depends(require_roles(["Super Admin", "Catalog Manager"])),
    db: AsyncSession = Depends(get_db)
):
    product = Product(
        category_id=req.category_id,
        name=req.name,
        name_hindi=req.name_hindi,
        slug=req.slug,
        brand=req.brand,
        hsn_code=req.hsn_code,
        gst_rate=req.gst_rate,
        origin=req.origin,
        grade=req.grade,
        description=req.description,
        description_hindi=req.description_hindi,
        storage_tips=req.storage_tips,
        shelf_life_days=req.shelf_life_days,
        is_perishable=req.is_perishable
    )
    db.add(product)
    await db.flush()

    for v in req.variants:
        variant = ProductVariant(
            product_id=product.id,
            sku=v.sku,
            pack_size=v.pack_size,
            pack_weight_kg=v.pack_weight_kg,
            unit=v.unit,
            base_price=v.base_price,
            moq=v.moq
        )
        db.add(variant)
        await db.flush()

        for s in v.slabs:
            slab = PriceSlab(
                variant_id=variant.id,
                min_qty=s.min_qty,
                max_qty=s.max_qty,
                slab_price=s.slab_price
            )
            db.add(slab)

    # Audit log
    audit = AuditLog(
        user_id=payload.get("sub"),
        user_email=payload.get("email"),
        action="CREATE_PRODUCT",
        entity="PRODUCT",
        entity_id=product.id,
        after_state={"name": product.name, "slug": product.slug}
    )
    db.add(audit)
    await db.commit()

    return {"message": "Product created successfully", "id": product.id, "slug": product.slug}

# Bulk Price Upload Preview & Update
@router.post("/bulk-price-update")
async def bulk_price_update(
    items: List[BulkPriceUpdateItem],
    payload: dict = Depends(require_roles(["Super Admin", "Catalog Manager"])),
    db: AsyncSession = Depends(get_db)
):
    updated = []
    errors = []
    for item in items:
        res = await db.execute(select(ProductVariant).where(ProductVariant.sku == item.sku))
        variant = res.scalars().first()
        if not variant:
            errors.append(f"SKU '{item.sku}' not found")
            continue
        
        old_price = variant.base_price
        variant.base_price = item.new_base_price
        updated.append({"sku": item.sku, "old_price": old_price, "new_price": item.new_base_price})
        
        audit = AuditLog(
            user_id=payload.get("sub"),
            user_email=payload.get("email"),
            action="UPDATE_PRICE",
            entity="PRODUCT_VARIANT",
            entity_id=variant.id,
            before_state={"price": old_price},
            after_state={"price": item.new_base_price}
        )
        db.add(audit)

    await db.commit()
    return {"updated_count": len(updated), "errors": errors, "updated_items": updated}
