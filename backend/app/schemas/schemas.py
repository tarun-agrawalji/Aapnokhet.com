from typing import Optional, List, Dict, Any
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field

# ----------------- AUTH -----------------
class RegisterRequest(BaseModel):
    legal_name: str
    trade_name: str
    business_type: str = "Restaurant"
    gstin: Optional[str] = None
    pan: Optional[str] = None
    fssai_no: Optional[str] = None
    contact_name: str
    email: EmailStr
    mobile: str
    password: str
    address_line: str
    city: str = "Jaipur"
    state: str = "Rajasthan"
    pincode: str

class LoginRequest(BaseModel):
    email_or_mobile: str
    password: str
    totp_code: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    mobile: str
    role_name: str
    company_id: Optional[str] = None
    spend_limit: float = 50000.0
    status: str

# ----------------- KYB & ADDRESS -----------------
class KybSubmitRequest(BaseModel):
    gstin: str
    pan: str
    fssai_no: str
    documents: List[Dict[str, str]] # [{"doc_type": "GST_CERT", "file_url": "..."}]

class KybReviewRequest(BaseModel):
    status: str # APPROVED, REJECTED
    credit_limit: float = 100000.0
    credit_days: int = 15
    rejection_reason: Optional[str] = None

class AddressCreate(BaseModel):
    outlet_name: str
    contact_person: Optional[str] = None
    contact_phone: Optional[str] = None
    line1: str
    city: str = "Jaipur"
    state: str = "Rajasthan"
    pincode: str
    is_default: bool = False

# ----------------- CATALOG & PURITY -----------------
class PriceSlabSchema(BaseModel):
    min_qty: int
    max_qty: int
    slab_price: float

class VariantCreate(BaseModel):
    sku: str
    pack_size: str
    pack_weight_kg: float = 25.0
    unit: str = "kg"
    base_price: float
    moq: int = 1
    slabs: List[PriceSlabSchema] = []

class ProductCreate(BaseModel):
    category_id: str
    name: str
    name_hindi: Optional[str] = None
    slug: str
    brand: str = "AapnoKhet Pure"
    hsn_code: str = "1006"
    gst_rate: float = 5.0
    origin: str = "Rajasthan, India"
    grade: str = "A Grade Pure"
    description: str
    description_hindi: Optional[str] = None
    storage_tips: Optional[str] = None
    shelf_life_days: int = 180
    is_perishable: bool = False
    variants: List[VariantCreate]

class LabReportCreate(BaseModel):
    batch_id: Optional[str] = None
    product_id: str
    lab_name: str
    report_no: str
    report_url: str
    tested_on: date
    parameters: Dict[str, Any]
    result: str = "COMPLIANT_PURE"

# ----------------- PRICING -----------------
class PriceCalcItem(BaseModel):
    variant_id: str
    qty: int

class PriceCalculationRequest(BaseModel):
    company_id: Optional[str] = None
    items: List[PriceCalcItem]
    pincode: Optional[str] = None

class BulkPriceUpdateItem(BaseModel):
    sku: str
    new_base_price: float
    effective_from: Optional[datetime] = None

# ----------------- INVENTORY & BATCHES -----------------
class InwardBatchRequest(BaseModel):
    variant_id: str
    warehouse_id: str
    batch_no: str
    mfg_date: date
    expiry_date: date
    qty: int
    qc_status: str = "PASSED"

class StockAdjustmentRequest(BaseModel):
    batch_id: str
    qty_change: int # + or -
    reason: str

# ----------------- CART & CHECKOUT -----------------
class AddToCartRequest(BaseModel):
    variant_id: str
    qty: int

class CheckoutRequest(BaseModel):
    address_id: str
    delivery_date: date
    delivery_slot: str = "Morning 6 AM - 10 AM"
    payment_mode: str = "CREDIT" # CREDIT, ONLINE_UPI, COD
    special_notes: Optional[str] = None

# ----------------- LOGISTICS & POD -----------------
class AssignDeliveryRequest(BaseModel):
    order_id: str
    vehicle_id: str
    driver_id: str
    run_sheet_no: Optional[str] = None

class PodSubmitRequest(BaseModel):
    otp_code: str
    photo_url: Optional[str] = None
    signature_url: Optional[str] = None
    receiver_name: str
    lat: Optional[float] = None
    lng: Optional[float] = None

# ----------------- AI WRITING HELPER -----------------
class AiGenerateRequest(BaseModel):
    purpose: str # product_short, product_long, banner, sms, faq
    product_name: Optional[str] = None
    facts: str # key points to include
    language: str = "English" # English, Hindi
    target_length: Optional[int] = None

class AiGenerateResponse(BaseModel):
    draft_text: str
    passes_rules: bool
    rule_feedback: List[str]
    word_count: int
    has_dashes: bool

# ----------------- CMS -----------------
class BannerCreate(BaseModel):
    title: str
    tagline: Optional[str] = None
    image_url: str
    mobile_image_url: Optional[str] = None
    link_url: str = "/catalog"
    visible: bool = True
    sort_order: int = 0
