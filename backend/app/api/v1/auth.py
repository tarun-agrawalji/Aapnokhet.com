from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_user_payload
from app.models.entities import User, Company, Address, CreditAccount
from app.schemas.schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication & Account"])

@router.post("/register", response_model=TokenResponse)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    # Check if email or mobile exists
    existing = await db.execute(select(User).where((User.email == req.email) | (User.mobile == req.mobile)))
    if existing.scalars().first():
        raise HTTPException(status_code=400, detail="User with this email or mobile already exists")
    
    # Check if GSTIN exists if provided
    if req.gstin:
        existing_comp = await db.execute(select(Company).where(Company.gstin == req.gstin))
        if existing_comp.scalars().first():
            raise HTTPException(status_code=400, detail="Company with this GSTIN is already registered")

    # 1. Create Company
    company = Company(
        legal_name=req.legal_name,
        trade_name=req.trade_name,
        gstin=req.gstin,
        pan=req.pan,
        fssai_no=req.fssai_no,
        business_type=req.business_type,
        kyb_status="PENDING"
    )
    db.add(company)
    await db.flush()

    # 2. Create Default Address
    address = Address(
        company_id=company.id,
        outlet_name="Main Kitchen / Outlet",
        contact_person=req.contact_name,
        contact_phone=req.mobile,
        line1=req.address_line,
        city=req.city,
        state=req.state,
        pincode=req.pincode,
        is_default=True
    )
    db.add(address)

    # 3. Create Default Credit Account
    credit_acc = CreditAccount(
        company_id=company.id,
        credit_limit=50000.0,
        credit_days=7,
        outstanding=0.0
    )
    db.add(credit_acc)

    # 4. Create User (Buyer Owner)
    user = User(
        company_id=company.id,
        role_name="Buyer Owner",
        name=req.contact_name,
        email=req.email,
        mobile=req.mobile,
        password_hash=get_password_hash(req.password),
        status="ACTIVE"
    )
    db.add(user)
    await db.flush()

    # Generate token
    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role_name,
        "company_id": company.id,
        "name": user.name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role_name,
            "company_id": company.id,
            "company_name": company.trade_name,
            "kyb_status": company.kyb_status
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).where((User.email == req.email_or_mobile) | (User.mobile == req.email_or_mobile))
    )
    user = result.scalars().first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email/mobile or password")
    
    if user.status != "ACTIVE":
        raise HTTPException(status_code=403, detail="Your account has been deactivated. Please contact support.")

    # Fetch company if associated
    company_name = "Internal Staff"
    kyb_status = "APPROVED"
    if user.company_id:
        comp_res = await db.execute(select(Company).where(Company.id == user.company_id))
        comp = comp_res.scalars().first()
        if comp:
            company_name = comp.trade_name
            kyb_status = comp.kyb_status

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role_name,
        "company_id": user.company_id,
        "name": user.name
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role_name,
            "company_id": user.company_id,
            "company_name": company_name,
            "kyb_status": kyb_status
        }
    }

@router.get("/me")
async def get_me(payload: dict = Depends(get_current_user_payload), db: AsyncSession = Depends(get_db)):
    user_id = payload.get("sub")
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    comp_info = None
    if user.company_id:
        c_res = await db.execute(select(Company).where(Company.id == user.company_id))
        comp = c_res.scalars().first()
        if comp:
            comp_info = {
                "id": comp.id,
                "legal_name": comp.legal_name,
                "trade_name": comp.trade_name,
                "gstin": comp.gstin,
                "fssai_no": comp.fssai_no,
                "kyb_status": comp.kyb_status,
                "credit_account": {
                    "limit": comp.credit_account.credit_limit if comp.credit_account else 0,
                    "outstanding": comp.credit_account.outstanding if comp.credit_account else 0,
                    "days": comp.credit_account.credit_days if comp.credit_account else 0
                } if comp.credit_account else None
            }

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "role": user.role_name,
        "spend_limit": user.spend_limit,
        "company": comp_info
    }
