from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone, date, timedelta
import random
from app.core.database import get_db
from app.core.security import get_current_user_payload
from app.models.entities import (
    Cart, CartItem, Order, OrderItem, OrderStatusHistory,
    ProductVariant, Product, Batch, StockReservation, StockMovement,
    CreditAccount, Company, Address, Invoice, LedgerEntry, User
)
from app.schemas.schemas import AddToCartRequest, CheckoutRequest
from app.api.v1.pricing import calculate_unit_price

router = APIRouter(prefix="/orders", tags=["Cart, Checkout & Orders"])

# ----------------- CART -----------------
@router.get("/cart")
async def get_cart(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    user_id = payload.get("sub")
    company_id = payload.get("company_id")

    res = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(
            selectinload(Cart.items)
            .selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
        )
    )
    cart = res.scalars().first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.commit()
        return {"items": [], "subtotal": 0.0, "tax_total": 0.0, "grand_total": 0.0}

    items_data = []
    subtotal = 0.0
    tax_total = 0.0

    for item in cart.items:
        v = item.variant
        p = v.product
        unit_price = await calculate_unit_price(v, item.qty, company_id, db)
        item_sub = unit_price * item.qty
        gst_rate = p.gst_rate if p else 5.0
        item_tax = (item_sub * gst_rate) / 100.0

        subtotal += item_sub
        tax_total += item_tax

        items_data.append({
            "id": item.id,
            "variant_id": v.id,
            "sku": v.sku,
            "product_name": p.name if p else "",
            "pack_size": v.pack_size,
            "unit": v.unit,
            "qty": item.qty,
            "moq": v.moq,
            "unit_price": unit_price,
            "subtotal": round(item_sub, 2),
            "gst_rate": gst_rate,
            "tax_amount": round(item_tax, 2),
            "total": round(item_sub + item_tax, 2)
        })

    return {
        "items": items_data,
        "subtotal": round(subtotal, 2),
        "tax_total": round(tax_total, 2),
        "grand_total": round(subtotal + tax_total, 2)
    }

@router.post("/cart/add")
async def add_to_cart(
    req: AddToCartRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    user_id = payload.get("sub")
    variant = await db.get(ProductVariant, req.variant_id)
    if not variant:
        raise HTTPException(status_code=404, detail="Product variant not found")

    if req.qty < variant.moq:
        raise HTTPException(status_code=400, detail=f"Minimum order quantity for this item is {variant.moq}")

    # Fetch or create cart
    c_res = await db.execute(select(Cart).where(Cart.user_id == user_id).options(selectinload(Cart.items)))
    cart = c_res.scalars().first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.flush()

    # Check if item exists in cart
    existing_item = next((i for i in cart.items if i.variant_id == req.variant_id), None)
    if existing_item:
        existing_item.qty += req.qty
    else:
        new_item = CartItem(cart_id=cart.id, variant_id=req.variant_id, qty=req.qty)
        db.add(new_item)

    await db.commit()
    return {"message": "Item added to cart successfully"}

@router.delete("/cart/item/{item_id}")
async def remove_cart_item(
    item_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    item = await db.get(CartItem, item_id)
    if item:
        await db.delete(item)
        await db.commit()
    return {"message": "Item removed from cart"}

# ----------------- ATOMIC CHECKOUT -----------------
@router.post("/checkout")
async def checkout(
    req: CheckoutRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    user_id = payload.get("sub")
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Only registered business buyers can place orders")

    user = await db.get(User, user_id)
    company = await db.get(Company, company_id)
    address = await db.get(Address, req.address_id)
    if not address or address.company_id != company_id:
        raise HTTPException(status_code=400, detail="Invalid delivery address")

    # Fetch cart
    c_res = await db.execute(
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(
            selectinload(Cart.items)
            .selectinload(CartItem.variant)
            .selectinload(ProductVariant.product)
        )
    )
    cart = c_res.scalars().first()
    if not cart or not cart.items:
        raise HTTPException(status_code=400, detail="Your cart is empty")

    # 1. Calculate price and tax
    subtotal = 0.0
    tax_total = 0.0
    items_to_order = []

    for ci in cart.items:
        v = ci.variant
        p = v.product
        unit_price = await calculate_unit_price(v, ci.qty, company_id, db)
        item_sub = unit_price * ci.qty
        gst_rate = p.gst_rate if p else 5.0
        item_tax = (item_sub * gst_rate) / 100.0

        subtotal += item_sub
        tax_total += item_tax

        items_to_order.append({
            "variant": v,
            "product": p,
            "qty": ci.qty,
            "unit_price": unit_price,
            "tax_rate": gst_rate,
            "tax_amount": item_tax,
            "total_amount": item_sub + item_tax
        })

    delivery_fee = 0.0 if subtotal >= 3000.0 else 150.0
    grand_total = subtotal + tax_total + delivery_fee

    # 2. Check Sub-user spend limit
    if user.role_name == "Buyer Staff" and grand_total > user.spend_limit:
        raise HTTPException(
            status_code=403,
            detail=f"Order amount (₹{grand_total:,.2f}) exceeds your spend limit (₹{user.spend_limit:,.2f}). Requires owner approval."
        )

    # 3. Credit Account Check (if paying via CREDIT)
    credit_account = None
    if req.payment_mode == "CREDIT":
        cr_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == company_id))
        credit_account = cr_res.scalars().first()
        if not credit_account or credit_account.is_blocked:
            raise HTTPException(status_code=400, detail="Credit terms are currently blocked. Please choose Online UPI payment.")
        
        available_credit = credit_account.credit_limit - credit_account.outstanding
        if grand_total > available_credit:
            raise HTTPException(
                status_code=400,
                detail=f"Order exceeds available credit limit. Available: ₹{available_credit:,.2f}. Please pay online."
            )

    # 4. FEFO Batch Allocation & Stock Reservation
    allocated_items = []
    for it in items_to_order:
        variant = it["variant"]
        needed_qty = it["qty"]

        # Fetch batches in FEFO order (closest expiry first)
        b_res = await db.execute(
            select(Batch)
            .where(
                Batch.variant_id == variant.id,
                Batch.qc_status == "PASSED",
                Batch.expiry_date > date.today(),
                (Batch.qty_available - Batch.qty_reserved) > 0
            )
            .order_by(Batch.expiry_date.asc())
        )
        available_batches = b_res.scalars().all()

        total_avail = sum((b.qty_available - b.qty_reserved) for b in available_batches)
        if total_avail < needed_qty:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {variant.sku}. Requested {needed_qty}, only {total_avail} available."
            )

        # Allocate from earliest expiry batches
        remaining_to_allocate = needed_qty
        chosen_batch = None
        for b in available_batches:
            can_take = min(remaining_to_allocate, (b.qty_available - b.qty_reserved))
            b.qty_reserved += can_take
            remaining_to_allocate -= can_take
            chosen_batch = b # link to primary batch
            if remaining_to_allocate == 0:
                break

        allocated_items.append((it, chosen_batch))

    # 5. Create Order
    rand_suffix = random.randint(100000, 999999)
    order_no = f"AK-{datetime.now().strftime('%y%m')}-{rand_suffix}"

    order = Order(
        order_no=order_no,
        company_id=company_id,
        placed_by_user_id=user_id,
        address_id=req.address_id,
        status="CONFIRMED",
        subtotal=round(subtotal, 2),
        tax_total=round(tax_total, 2),
        delivery_fee=round(delivery_fee, 2),
        grand_total=round(grand_total, 2),
        payment_mode=req.payment_mode,
        payment_status="PENDING" if req.payment_mode == "CREDIT" else "PAID",
        delivery_date=req.delivery_date,
        delivery_slot=req.delivery_slot,
        special_notes=req.special_notes
    )
    db.add(order)
    await db.flush()

    # 6. Create Order Items & Stock Movement
    for it, batch in allocated_items:
        oi = OrderItem(
            order_id=order.id,
            variant_id=it["variant"].id,
            batch_id=batch.id if batch else None,
            qty=it["qty"],
            unit_price=it["unit_price"],
            tax_rate=it["tax_rate"],
            tax_amount=round(it["tax_amount"], 2),
            total_amount=round(it["total_amount"], 2)
        )
        db.add(oi)

    # Status History
    hist = OrderStatusHistory(
        order_id=order.id,
        status="CONFIRMED",
        notes="Order placed and stock reserved via FEFO algorithm.",
        changed_by=user.name
    )
    db.add(hist)

    # 7. Generate GST Tax Invoice
    inv_no = f"INV/{datetime.now().strftime('%y-%m')}/{rand_suffix}"
    cgst = round(tax_total / 2.0, 2)
    sgst = round(tax_total / 2.0, 2)
    invoice = Invoice(
        order_id=order.id,
        invoice_no=inv_no,
        financial_year="2026-27",
        subtotal=round(subtotal, 2),
        cgst=cgst,
        sgst=sgst,
        igst=0.0,
        grand_total=round(grand_total, 2),
        due_date=date.today() + timedelta(days=credit_account.credit_days if credit_account else 7),
        status="ISSUED"
    )
    db.add(invoice)

    # 8. Update Credit Account & Ledger
    if req.payment_mode == "CREDIT" and credit_account:
        credit_account.outstanding += grand_total
        ledger = LedgerEntry(
            company_id=company_id,
            entry_type="DEBIT",
            debit=round(grand_total, 2),
            credit=0.0,
            balance_after=round(credit_account.outstanding, 2),
            ref_type="INVOICE",
            ref_id=inv_no,
            description=f"Tax Invoice {inv_no} for Order {order_no}"
        )
        db.add(ledger)

    # 9. Clear Cart Items
    for ci in cart.items:
        await db.delete(ci)

    await db.commit()

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
        "order_no": order.order_no,
        "invoice_no": inv_no,
        "grand_total": round(grand_total, 2),
        "status": order.status
    }

# ----------------- ORDERS LIST & DETAIL -----------------
@router.get("/")
async def list_orders(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    user_role = payload.get("role", "")

    query = (
        select(Order)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant).selectinload(ProductVariant.product),
            selectinload(Order.address),
            selectinload(Order.invoice),
            selectinload(Order.company)
        )
        .order_by(Order.created_at.desc())
    )
    # If not admin, restrict to company
    if "Super Admin" not in user_role and "Dispatch" not in user_role and "Finance" not in user_role:
        if not company_id:
            return []
        query = query.where(Order.company_id == company_id)

    res = await db.execute(query)
    orders = res.scalars().all()

    return [
        {
            "id": o.id,
            "order_no": o.order_no,
            "company_name": o.company.trade_name if o.company else "",
            "status": o.status,
            "delivery_date": str(o.delivery_date),
            "delivery_slot": o.delivery_slot,
            "grand_total": o.grand_total,
            "payment_mode": o.payment_mode,
            "payment_status": o.payment_status,
            "created_at": o.created_at.isoformat() if o.created_at else "",
            "item_count": len(o.items),
            "invoice_no": o.invoice.invoice_no if o.invoice else None
        }
        for o in orders
    ]

@router.get("/{order_id}")
async def get_order_detail(
    order_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Order)
        .where(Order.id == order_id)
        .options(
            selectinload(Order.items).selectinload(OrderItem.variant).selectinload(ProductVariant.product),
            selectinload(Order.items).selectinload(OrderItem.batch),
            selectinload(Order.address),
            selectinload(Order.invoice),
            selectinload(Order.status_history)
        )
    )
    o = res.scalars().first()
    if not o:
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        "id": o.id,
        "order_no": o.order_no,
        "status": o.status,
        "subtotal": o.subtotal,
        "tax_total": o.tax_total,
        "delivery_fee": o.delivery_fee,
        "grand_total": o.grand_total,
        "payment_mode": o.payment_mode,
        "payment_status": o.payment_status,
        "delivery_date": str(o.delivery_date),
        "delivery_slot": o.delivery_slot,
        "address": {
            "outlet_name": o.address.outlet_name,
            "line1": o.address.line1,
            "city": o.address.city,
            "pincode": o.address.pincode
        } if o.address else None,
        "invoice": {
            "invoice_no": o.invoice.invoice_no,
            "financial_year": o.invoice.financial_year,
            "due_date": str(o.invoice.due_date),
            "cgst": o.invoice.cgst,
            "sgst": o.invoice.sgst,
            "grand_total": o.invoice.grand_total
        } if o.invoice else None,
        "items": [
            {
                "sku": it.variant.sku if it.variant else "",
                "product_name": it.variant.product.name if (it.variant and it.variant.product) else "",
                "pack_size": it.variant.pack_size if it.variant else "",
                "qty": it.qty,
                "unit_price": it.unit_price,
                "tax_amount": it.tax_amount,
                "total_amount": it.total_amount,
                "batch_no": it.batch.batch_no if it.batch else None
            }
            for it in o.items
        ],
        "timeline": [
            {
                "status": h.status,
                "notes": h.notes,
                "changed_by": h.changed_by,
                "timestamp": h.created_at.isoformat() if h.created_at else ""
            }
            for h in o.status_history
        ]
    }

# 1-Click Reorder
@router.post("/reorder/{order_id}")
async def one_click_reorder(
    order_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    user_id = payload.get("sub")
    o = await db.get(Order, order_id)
    if not o:
        raise HTTPException(status_code=404, detail="Original order not found")

    # Fetch cart
    c_res = await db.execute(select(Cart).where(Cart.user_id == user_id).options(selectinload(Cart.items)))
    cart = c_res.scalars().first()
    if not cart:
        cart = Cart(user_id=user_id)
        db.add(cart)
        await db.flush()

    # Clear current cart and clone items
    for ci in cart.items:
        await db.delete(ci)

    # Fetch order items
    items_res = await db.execute(select(OrderItem).where(OrderItem.order_id == order_id))
    order_items = items_res.scalars().all()

    for oi in order_items:
        new_ci = CartItem(cart_id=cart.id, variant_id=oi.variant_id, qty=oi.qty)
        db.add(new_ci)

    await db.commit()
    return {"message": f"Cart loaded with {len(order_items)} items from past order {o.order_no} for rapid checkout."}
