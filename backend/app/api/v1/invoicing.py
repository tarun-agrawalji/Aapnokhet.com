from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timezone
import random
from app.core.database import get_db
from app.core.config import settings
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import (
    Invoice, CreditNote, Order, OrderItem, ProductVariant, Product, Company, Address, LedgerEntry, CreditAccount
)

router = APIRouter(prefix="/invoicing", tags=["GST Invoicing & Credit Notes"])

@router.get("/")
async def list_invoices(
    financial_year: str = "2026-27",
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    user_role = payload.get("role", "")

    query = (
        select(Invoice)
        .options(
            selectinload(Invoice.order).selectinload(Order.company)
        )
        .where(Invoice.financial_year == financial_year)
        .order_by(Invoice.created_at.desc())
    )
    if "Super Admin" not in user_role and "Finance" not in user_role:
        if not company_id:
            return []
        query = query.join(Invoice.order).where(Order.company_id == company_id)

    res = await db.execute(query)
    invoices = res.scalars().all()

    return [
        {
            "id": inv.id,
            "invoice_no": inv.invoice_no,
            "order_no": inv.order.order_no if inv.order else "",
            "customer_name": inv.order.company.trade_name if (inv.order and inv.order.company) else "",
            "subtotal": inv.subtotal,
            "cgst": inv.cgst,
            "sgst": inv.sgst,
            "igst": inv.igst,
            "grand_total": inv.grand_total,
            "due_date": str(inv.due_date),
            "status": inv.status,
            "created_at": inv.created_at.isoformat() if inv.created_at else ""
        }
        for inv in invoices
    ]

@router.get("/{invoice_id}")
async def get_invoice_detail(
    invoice_id: str,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Invoice)
        .where(Invoice.id == invoice_id)
        .options(
            selectinload(Invoice.order).selectinload(Order.company),
            selectinload(Invoice.order).selectinload(Order.address),
            selectinload(Invoice.order).selectinload(Order.items).selectinload(OrderItem.variant).selectinload(ProductVariant.product),
            selectinload(Invoice.credit_notes)
        )
    )
    inv = res.scalars().first()
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    order = inv.order
    company = order.company if order else None
    address = order.address if order else None

    # Compute HSN-wise tax summary
    hsn_summary = {}
    items_data = []

    if order:
        for it in order.items:
            prod = it.variant.product if it.variant else None
            hsn = prod.hsn_code if prod else "1006"
            taxable_val = it.unit_price * it.qty
            tax_rate = it.tax_rate
            tax_val = it.tax_amount

            if hsn not in hsn_summary:
                hsn_summary[hsn] = {
                    "hsn_code": hsn,
                    "taxable_amount": 0.0,
                    "cgst_amount": 0.0,
                    "sgst_amount": 0.0,
                    "igst_amount": 0.0
                }
            hsn_summary[hsn]["taxable_amount"] += taxable_val
            hsn_summary[hsn]["cgst_amount"] += (tax_val / 2.0)
            hsn_summary[hsn]["sgst_amount"] += (tax_val / 2.0)

            items_data.append({
                "sku": it.variant.sku if it.variant else "",
                "product_name": prod.name if prod else "",
                "pack_size": it.variant.pack_size if it.variant else "",
                "hsn_code": hsn,
                "qty": it.qty,
                "unit": it.variant.unit if it.variant else "kg",
                "unit_price": it.unit_price,
                "taxable_amount": round(taxable_val, 2),
                "tax_rate": tax_rate,
                "cgst_rate": tax_rate / 2.0,
                "sgst_rate": tax_rate / 2.0,
                "tax_amount": round(tax_val, 2),
                "total_amount": round(taxable_val + tax_val, 2)
            })

    return {
        "invoice_no": inv.invoice_no,
        "financial_year": inv.financial_year,
        "date": inv.created_at.strftime("%d-%m-%Y") if inv.created_at else "",
        "due_date": inv.due_date.strftime("%d-%m-%Y") if inv.due_date else "",
        "order_no": order.order_no if order else "",
        "seller": {
            "name": settings.SELLER_NAME,
            "address": settings.SELLER_ADDRESS,
            "gstin": settings.SELLER_GSTIN,
            "fssai_no": settings.SELLER_FSSAI,
            "state": settings.SELLER_STATE,
            "state_code": settings.SELLER_STATE_CODE,
            "phone": settings.SELLER_PHONE,
            "email": settings.SELLER_EMAIL
        },
        "buyer": {
            "legal_name": company.legal_name if company else "",
            "trade_name": company.trade_name if company else "",
            "gstin": company.gstin if company else "URP (Unregistered)",
            "fssai_no": company.fssai_no if company else "",
            "outlet_name": address.outlet_name if address else "",
            "address": f"{address.line1}, {address.city}, {address.state} - {address.pincode}" if address else ""
        },
        "items": items_data,
        "hsn_summary": list(hsn_summary.values()),
        "subtotal": inv.subtotal,
        "cgst": inv.cgst,
        "sgst": inv.sgst,
        "igst": inv.igst,
        "grand_total": inv.grand_total,
        "status": inv.status,
        "credit_notes": [
            {"no": cn.credit_note_no, "amount": cn.amount, "reason": cn.reason}
            for cn in inv.credit_notes
        ]
    }

# Issue Credit Note
@router.post("/credit-note")
async def issue_credit_note(
    invoice_id: str,
    amount: float,
    reason: str,
    payload: dict = Depends(require_roles(["Super Admin", "Finance"])),
    db: AsyncSession = Depends(get_db)
):
    inv = await db.get(Invoice, invoice_id)
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if amount > inv.grand_total:
        raise HTTPException(status_code=400, detail="Credit note amount cannot exceed invoice grand total")

    order = await db.get(Order, inv.order_id)
    cn_no = f"CN/{datetime.now().strftime('%y-%m')}/{random.randint(1000, 9999)}"

    credit_note = CreditNote(
        invoice_id=inv.id,
        credit_note_no=cn_no,
        amount=amount,
        reason=reason
    )
    db.add(credit_note)

    # Adjust Ledger & Customer Credit Account
    if order and order.company_id:
        cr_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == order.company_id))
        credit = cr_res.scalars().first()
        if credit:
            credit.outstanding = max(0.0, credit.outstanding - amount)
            ledger = LedgerEntry(
                company_id=order.company_id,
                entry_type="CREDIT",
                debit=0.0,
                credit=amount,
                balance_after=credit.outstanding,
                ref_type="CREDIT_NOTE",
                ref_id=cn_no,
                description=f"GST Credit Note {cn_no} for Invoice {inv.invoice_no}: {reason}"
            )
            db.add(ledger)

    await db.commit()
    return {"message": "Credit note issued successfully", "credit_note_no": cn_no, "adjusted_amount": amount}
