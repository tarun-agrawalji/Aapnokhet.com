from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
import random
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import (
    Order, OrderItem, Delivery, Vehicle, Driver, ProofOfDelivery,
    OrderStatusHistory, ProductVariant, Product, Address
)
from app.schemas.schemas import AssignDeliveryRequest, PodSubmitRequest

router = APIRouter(prefix="/fulfillment", tags=["Fulfillment, Logistics & Driver PWA"])

@router.get("/fleet")
async def list_fleet(
    payload: dict = Depends(require_roles(["Super Admin", "Dispatch Manager"])),
    db: AsyncSession = Depends(get_db)
):
    veh_res = await db.execute(select(Vehicle).where(Vehicle.is_active == True))
    vehicles = veh_res.scalars().all()
    
    drv_res = await db.execute(select(Driver).where(Driver.is_active == True))
    drivers = drv_res.scalars().all()

    return {
        "vehicles": [
            {"id": v.id, "reg_no": v.reg_no, "type": v.vehicle_type, "is_refrigerated": v.is_refrigerated}
            for v in vehicles
        ],
        "drivers": [
            {"id": d.id, "name": d.name, "mobile": d.mobile, "license_no": d.license_no}
            for d in drivers
        ]
    }

@router.post("/assign")
async def assign_delivery(
    req: AssignDeliveryRequest,
    payload: dict = Depends(require_roles(["Super Admin", "Dispatch Manager"])),
    db: AsyncSession = Depends(get_db)
):
    order = await db.get(Order, req.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    vehicle = await db.get(Vehicle, req.vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    driver = await db.get(Driver, req.driver_id)
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")

    # Cold chain safety check: if order has perishable items, ensure vehicle is refrigerated
    items_res = await db.execute(
        select(OrderItem)
        .where(OrderItem.order_id == order.id)
        .options(selectinload(OrderItem.variant).selectinload(ProductVariant.product))
    )
    items = items_res.scalars().all()
    has_perishable = any(
        (it.variant and it.variant.product and it.variant.product.is_perishable)
        for it in items
    )
    if has_perishable and not vehicle.is_refrigerated:
        raise HTTPException(
            status_code=400,
            detail="Cold-chain violation: This order contains perishable dairy products and MUST be assigned to a refrigerated vehicle."
        )

    # Fetch or create delivery
    del_res = await db.execute(select(Delivery).where(Delivery.order_id == order.id))
    delivery = del_res.scalars().first()
    if not delivery:
        delivery = Delivery(order_id=order.id)
        db.add(delivery)
        await db.flush()

    delivery.vehicle_id = req.vehicle_id
    delivery.driver_id = req.driver_id
    delivery.status = "DISPATCHED"
    delivery.run_sheet_no = req.run_sheet_no or f"RUN-{datetime.now().strftime('%d%m')}-01"

    order.status = "DISPATCHED"

    # Generate 4-digit OTP for POD
    otp = str(random.randint(1000, 9999))
    pod_res = await db.execute(select(ProofOfDelivery).where(ProofOfDelivery.delivery_id == delivery.id))
    pod = pod_res.scalars().first()
    if not pod:
        pod = ProofOfDelivery(delivery_id=delivery.id, otp_code=otp)
        db.add(pod)
    else:
        pod.otp_code = otp

    hist = OrderStatusHistory(
        order_id=order.id,
        status="DISPATCHED",
        notes=f"Dispatched via {vehicle.reg_no} driven by {driver.name} (Delivery OTP generated).",
        changed_by=payload.get("name", "Dispatch Team")
    )
    db.add(hist)

    await db.commit()
    return {
        "message": "Delivery assigned and dispatched successfully",
        "delivery_id": delivery.id,
        "run_sheet_no": delivery.run_sheet_no,
        "delivery_otp": otp
    }

# Driver PWA: List assigned deliveries for today
@router.get("/driver-trips")
async def get_driver_trips(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    # Fetch all deliveries currently out or assigned
    res = await db.execute(
        select(Delivery)
        .where(Delivery.status.in_(["ASSIGNED", "DISPATCHED", "OUT_FOR_DELIVERY"]))
        .options(
            selectinload(Delivery.order).selectinload(Order.address),
            selectinload(Delivery.order).selectinload(Order.company),
            selectinload(Delivery.driver),
            selectinload(Delivery.vehicle),
            selectinload(Delivery.pod)
        )
    )
    deliveries = res.scalars().all()

    return [
        {
            "delivery_id": d.id,
            "order_id": d.order_id,
            "order_no": d.order.order_no if d.order else "",
            "customer_name": d.order.company.trade_name if (d.order and d.order.company) else "",
            "contact_phone": d.order.address.contact_phone if (d.order and d.order.address) else "",
            "address": f"{d.order.address.line1}, {d.order.address.city} - {d.order.address.pincode}" if (d.order and d.order.address) else "",
            "delivery_slot": d.order.delivery_slot if d.order else "",
            "status": d.status,
            "run_sheet_no": d.run_sheet_no,
            "vehicle_reg": d.vehicle.reg_no if d.vehicle else "",
            "grand_total": d.order.grand_total if d.order else 0.0,
            "pod_otp_required": True
        }
        for d in deliveries
    ]

# Driver PWA: Complete Delivery with OTP verification
@router.post("/complete-pod/{delivery_id}")
async def complete_pod(
    delivery_id: str,
    req: PodSubmitRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    delivery = await db.get(Delivery, delivery_id)
    if not delivery:
        raise HTTPException(status_code=404, detail="Delivery record not found")

    pod_res = await db.execute(select(ProofOfDelivery).where(ProofOfDelivery.delivery_id == delivery.id))
    pod = pod_res.scalars().first()
    if not pod:
        raise HTTPException(status_code=400, detail="POD record not initialized for this delivery")

    # Verify OTP
    if pod.otp_code != req.otp_code:
        raise HTTPException(status_code=400, detail="Invalid Delivery OTP. Please ask the restaurant receiving manager.")

    pod.otp_verified = True
    pod.photo_url = req.photo_url
    pod.signature_url = req.signature_url
    pod.receiver_name = req.receiver_name
    pod.verified_at = datetime.now(timezone.utc)
    pod.lat = req.lat
    pod.lng = req.lng

    delivery.status = "DELIVERED"

    order = await db.get(Order, delivery.order_id)
    if order:
        order.status = "DELIVERED"
        hist = OrderStatusHistory(
            order_id=order.id,
            status="DELIVERED",
            notes=f"Delivered and verified via OTP by receiver: {req.receiver_name}",
            changed_by="Delivery Agent"
        )
        db.add(hist)

    await db.commit()
    return {"message": "Delivery completed and verified successfully with OTP Proof of Delivery."}
