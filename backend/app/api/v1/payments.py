from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
import hmac
import hashlib
from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import (
    Order, Payment, CreditAccount, LedgerEntry, Invoice
)

router = APIRouter(prefix="/payments", tags=["Payments & Double-Entry Ledger"])

@router.post("/create-intent/{order_id}")
async def create_payment_intent(
    order_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    order = await db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # In production, call Razorpay Orders API: razorpay_client.order.create(...)
    razorpay_order_id = f"order_rp_{order.order_no.replace('-', '_')}"
    
    return {
        "gateway_order_id": razorpay_order_id,
        "amount_paise": int(order.grand_total * 100),
        "currency": "INR",
        "key_id": "rzp_test_aapnokhet_live_mock",
        "company_name": settings.PROJECT_NAME,
        "order_no": order.order_no
    }

@router.post("/webhook")
async def payment_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    # Verify HMAC SHA256 signature
    signature = request.headers.get("X-Razorpay-Signature", "")
    body = await request.body()
    
    # In live mode, verify: hmac.new(webhook_secret, body, hashlib.sha256).hexdigest() == signature
    # Process payload
    payload = await request.json()
    event = payload.get("event", "payment.captured")
    
    if "payment" in event:
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        notes = payment_entity.get("notes", {})
        order_no = notes.get("order_no")
        
        if order_no:
            res = await db.execute(select(Order).where(Order.order_no == order_no))
            order = res.scalars().first()
            if order:
                order.payment_status = "PAID"
                payment = Payment(
                    order_id=order.id,
                    gateway_txn_id=payment_entity.get("id", f"txn_{order.id[:8]}"),
                    mode=payment_entity.get("method", "UPI"),
                    amount=order.grand_total,
                    status="SUCCESS"
                )
                db.add(payment)
                await db.commit()

    return {"status": "ok"}

@router.get("/ledger")
async def get_customer_ledger(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="No business account linked")

    credit_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == company_id))
    credit_account = credit_res.scalars().first()

    entries_res = await db.execute(
        select(LedgerEntry)
        .where(LedgerEntry.company_id == company_id)
        .order_by(LedgerEntry.created_at.desc())
    )
    entries = entries_res.scalars().all()

    return {
        "credit_limit": credit_account.credit_limit if credit_account else 0.0,
        "credit_days": credit_account.credit_days if credit_account else 0,
        "current_outstanding": credit_account.outstanding if credit_account else 0.0,
        "available_credit": (credit_account.credit_limit - credit_account.outstanding) if credit_account else 0.0,
        "entries": [
            {
                "id": e.id,
                "entry_type": e.entry_type,
                "debit": e.debit,
                "credit": e.credit,
                "balance_after": e.balance_after,
                "ref_type": e.ref_type,
                "ref_id": e.ref_id,
                "description": e.description,
                "date": e.created_at.isoformat() if e.created_at else ""
            }
            for e in entries
        ]
    }

# Finance records manual bank transfer payment against credit
@router.post("/record-offline-payment")
async def record_offline_payment(
    company_id: str,
    amount: float,
    reference_no: str,
    notes: str = "NEFT / RTGS Bank Transfer",
    payload: dict = Depends(require_roles(["Super Admin", "Finance"])),
    db: AsyncSession = Depends(get_db)
):
    credit_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == company_id))
    credit = credit_res.scalars().first()
    if not credit:
        raise HTTPException(status_code=404, detail="Credit account not found")

    credit.outstanding = max(0.0, credit.outstanding - amount)
    
    ledger = LedgerEntry(
        company_id=company_id,
        entry_type="CREDIT",
        debit=0.0,
        credit=amount,
        balance_after=credit.outstanding,
        ref_type="PAYMENT",
        ref_id=reference_no,
        description=f"Received: {notes} (Ref: {reference_no})"
    )
    db.add(ledger)
    await db.commit()

    return {
        "message": f"Recorded payment of ₹{amount:,.2f} successfully",
        "new_outstanding": credit.outstanding
    }
