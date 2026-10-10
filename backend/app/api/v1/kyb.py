from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import get_current_user_payload, require_roles
from app.models.entities import Company, KybDocument, Address, CreditAccount, DeliveryZone
from app.schemas.schemas import KybSubmitRequest, KybReviewRequest, AddressCreate

router = APIRouter(prefix="/kyb", tags=["KYB & Outlets"])

@router.post("/submit")
async def submit_kyb(
    req: KybSubmitRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="Only business accounts can submit KYB")
    
    comp = await db.get(Company, company_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
    
    comp.gstin = req.gstin
    comp.pan = req.pan
    comp.fssai_no = req.fssai_no
    comp.kyb_status = "PENDING"
    
    # Add documents
    for doc in req.documents:
        kyb_doc = KybDocument(
            company_id=company_id,
            doc_type=doc.get("doc_type", "OTHER"),
            file_url=doc.get("file_url", ""),
            status="PENDING"
        )
        db.add(kyb_doc)
    
    await db.commit()
    return {"message": "KYB documents submitted successfully for review", "status": "PENDING"}

@router.get("/status")
async def get_kyb_status(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="No company associated")
    
    comp = await db.get(Company, company_id)
    docs_res = await db.execute(select(KybDocument).where(KybDocument.company_id == company_id))
    docs = docs_res.scalars().all()
    
    credit_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == company_id))
    credit = credit_res.scalars().first()

    return {
        "company_id": comp.id,
        "legal_name": comp.legal_name,
        "gstin": comp.gstin,
        "fssai_no": comp.fssai_no,
        "kyb_status": comp.kyb_status,
        "rejection_reason": comp.kyb_rejection_reason,
        "documents": [
            {"id": d.id, "type": d.doc_type, "url": d.file_url, "status": d.status}
            for d in docs
        ],
        "credit_account": {
            "limit": credit.credit_limit if credit else 0,
            "days": credit.credit_days if credit else 0,
            "outstanding": credit.outstanding if credit else 0,
            "available": (credit.credit_limit - credit.outstanding) if credit else 0
        }
    }

# Sales Manager / Super Admin review
@router.post("/review/{company_id}")
async def review_kyb(
    company_id: str,
    req: KybReviewRequest,
    payload: dict = Depends(require_roles(["Super Admin", "Sales Manager"])),
    db: AsyncSession = Depends(get_db)
):
    comp = await db.get(Company, company_id)
    if not comp:
        raise HTTPException(status_code=404, detail="Company not found")
    
    comp.kyb_status = req.status
    if req.status == "REJECTED":
        comp.kyb_rejection_reason = req.rejection_reason or "Documents invalid or incomplete"
    else:
        comp.kyb_rejection_reason = None
        # Setup credit account
        credit_res = await db.execute(select(CreditAccount).where(CreditAccount.company_id == company_id))
        credit = credit_res.scalars().first()
        if not credit:
            credit = CreditAccount(company_id=company_id)
            db.add(credit)
        credit.credit_limit = req.credit_limit
        credit.credit_days = req.credit_days
        credit.is_blocked = False

    await db.commit()
    return {"message": f"Company KYB status updated to {req.status}", "company_id": company_id}

# Outlets / Addresses
@router.get("/addresses")
async def list_addresses(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        return []
    res = await db.execute(select(Address).where(Address.company_id == company_id, Address.is_active == True))
    addresses = res.scalars().all()
    return [
        {
            "id": a.id,
            "outlet_name": a.outlet_name,
            "contact_person": a.contact_person,
            "contact_phone": a.contact_phone,
            "line1": a.line1,
            "city": a.city,
            "state": a.state,
            "pincode": a.pincode,
            "is_default": a.is_default
        }
        for a in addresses
    ]

@router.post("/addresses")
async def add_address(
    req: AddressCreate,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db)
):
    company_id = payload.get("company_id")
    if not company_id:
        raise HTTPException(status_code=400, detail="No company associated")
    
    # Check pincode serviceability
    zones = await db.execute(select(DeliveryZone).where(DeliveryZone.is_active == True))
    all_zones = zones.scalars().all()
    is_serviceable = any(req.pincode in z.pincodes.split(",") for z in all_zones)
    
    address = Address(
        company_id=company_id,
        outlet_name=req.outlet_name,
        contact_person=req.contact_person,
        contact_phone=req.contact_phone,
        line1=req.line1,
        city=req.city,
        state=req.state,
        pincode=req.pincode,
        is_default=req.is_default
    )
    db.add(address)
    await db.commit()
    return {
        "id": address.id,
        "outlet_name": address.outlet_name,
        "is_serviceable": is_serviceable,
        "message": "Outlet address registered successfully"
    }
