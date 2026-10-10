from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.config import settings
from app.models.entities import (
    ProductVariant, PriceSlab, CustomerPrice, Product, DeliveryZone, Address
)
from app.schemas.schemas import PriceCalculationRequest

router = APIRouter(prefix="/pricing", tags=["Pricing Engine"])

async def calculate_unit_price(
    variant: ProductVariant,
    qty: int,
    company_id: str = None,
    db: AsyncSession = None
) -> float:
    # 1. Check Customer Negotiated Price
    if company_id:
        now = datetime.now(timezone.utc)
        cust_res = await db.execute(
            select(CustomerPrice).where(
                CustomerPrice.company_id == company_id,
                CustomerPrice.variant_id == variant.id,
                (CustomerPrice.valid_till == None) | (CustomerPrice.valid_till >= now)
            )
        )
        cust_price = cust_res.scalars().first()
        if cust_price:
            return cust_price.custom_price

    # 2. Check Volume Slab Pricing
    slab_res = await db.execute(
        select(PriceSlab).where(
            PriceSlab.variant_id == variant.id,
            PriceSlab.min_qty <= qty,
            PriceSlab.max_qty >= qty
        )
    )
    slab = slab_res.scalars().first()
    if slab:
        return slab.slab_price

    # 3. Default: Base Variant Price
    return variant.base_price

@router.post("/calculate")
async def calculate_order_price(req: PriceCalculationRequest, db: AsyncSession = Depends(get_db)):
    subtotal = 0.0
    tax_total = 0.0
    line_items = []
    
    # Check if delivery state matches seller state (Rajasthan)
    is_intra_state = True
    pincode_zone = None

    if req.pincode:
        zones_res = await db.execute(select(DeliveryZone).where(DeliveryZone.is_active == True))
        for zone in zones_res.scalars().all():
            if req.pincode in zone.pincodes.split(","):
                pincode_zone = zone
                break

    for item in req.items:
        res = await db.execute(
            select(ProductVariant)
            .where(ProductVariant.id == item.variant_id)
        )
        variant = res.scalars().first()
        if not variant:
            raise HTTPException(status_code=404, detail=f"Variant {item.variant_id} not found")
        
        # Fetch parent product for GST rate and HSN
        prod = await db.get(Product, variant.product_id)

        unit_price = await calculate_unit_price(variant, item.qty, req.company_id, db)
        item_subtotal = unit_price * item.qty
        gst_rate = prod.gst_rate if prod else 5.0
        item_tax = (item_subtotal * gst_rate) / 100.0

        subtotal += item_subtotal
        tax_total += item_tax

        line_items.append({
            "variant_id": variant.id,
            "sku": variant.sku,
            "product_name": prod.name if prod else "",
            "pack_size": variant.pack_size,
            "unit": variant.unit,
            "qty": item.qty,
            "unit_price": unit_price,
            "subtotal": round(item_subtotal, 2),
            "gst_rate": gst_rate,
            "tax_amount": round(item_tax, 2),
            "total": round(item_subtotal + item_tax, 2)
        })

    # Delivery Fee Calculation
    delivery_fee = 0.0
    if pincode_zone:
        if subtotal < pincode_zone.free_delivery_above:
            delivery_fee = pincode_zone.delivery_fee
    elif subtotal < 3000.0:
        delivery_fee = 150.0

    grand_total = subtotal + tax_total + delivery_fee

    return {
        "subtotal": round(subtotal, 2),
        "tax_total": round(tax_total, 2),
        "cgst": round(tax_total / 2.0, 2) if is_intra_state else 0.0,
        "sgst": round(tax_total / 2.0, 2) if is_intra_state else 0.0,
        "igst": round(tax_total, 2) if not is_intra_state else 0.0,
        "delivery_fee": round(delivery_fee, 2),
        "grand_total": round(grand_total, 2),
        "line_items": line_items,
        "is_serviceable": True if (pincode_zone or not req.pincode) else False
    }
