import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Date, Time,
    ForeignKey, Text, JSON, Numeric
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid() -> str:
    return str(uuid.uuid4())

def now_utc() -> datetime:
    return datetime.now(timezone.utc)

# ----------------- AUTH & COMPANY -----------------
class Company(Base):
    __tablename__ = "companies"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    legal_name = Column(String(255), nullable=False)
    trade_name = Column(String(255), nullable=False)
    gstin = Column(String(15), unique=True, index=True, nullable=True)
    pan = Column(String(10), nullable=True)
    fssai_no = Column(String(14), nullable=True)
    business_type = Column(String(50), default="Restaurant") # Hotel, Caterer, Cloud Kitchen
    kyb_status = Column(String(30), default="PENDING") # PENDING, APPROVED, REJECTED
    kyb_rejection_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    users = relationship("User", back_populates="company")
    addresses = relationship("Address", back_populates="company")
    credit_account = relationship("CreditAccount", uselist=False, back_populates="company")
    orders = relationship("Order", back_populates="company")
    documents = relationship("KybDocument", back_populates="company")
    ledger_entries = relationship("LedgerEntry", back_populates="company")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=True)
    role_name = Column(String(50), nullable=False) # Buyer Owner, Buyer Staff, Super Admin, Content Manager, Catalog Manager, Warehouse Manager, Sales Manager, Dispatch Manager, Delivery Agent, Finance, Support Agent
    name = Column(String(150), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    mobile = Column(String(20), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(100), nullable=True)
    spend_limit = Column(Float, default=50000.0) # for Buyer Staff sub-users
    status = Column(String(30), default="ACTIVE") # ACTIVE, DISABLED
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    company = relationship("Company", back_populates="users")
    orders = relationship("Order", back_populates="placed_by_user")
    cart = relationship("Cart", uselist=False, back_populates="user")

class Address(Base):
    __tablename__ = "addresses"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    outlet_name = Column(String(150), default="Main Branch")
    contact_person = Column(String(150), nullable=True)
    contact_phone = Column(String(20), nullable=True)
    line1 = Column(Text, nullable=False)
    city = Column(String(100), default="Jaipur")
    state = Column(String(100), default="Rajasthan")
    pincode = Column(String(10), nullable=False)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    is_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    company = relationship("Company", back_populates="addresses")

class KybDocument(Base):
    __tablename__ = "kyb_documents"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    doc_type = Column(String(50), nullable=False) # GST_CERT, FSSAI_LIC, PAN_CARD, CHEQUE
    file_url = Column(String(500), nullable=False)
    status = Column(String(30), default="PENDING") # PENDING, VERIFIED, REJECTED
    reviewed_by = Column(String(100), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    company = relationship("Company", back_populates="documents")

class CreditAccount(Base):
    __tablename__ = "credit_accounts"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), unique=True, nullable=False)
    credit_limit = Column(Float, default=100000.0) # INR
    credit_days = Column(Integer, default=15) # Net 15
    outstanding = Column(Float, default=0.0) # Current unpaid balance
    is_blocked = Column(Boolean, default=False)
    
    company = relationship("Company", back_populates="credit_account")

# ----------------- CATALOG & PURITY -----------------
class Category(Base):
    __tablename__ = "categories"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    is_perishable = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    category_id = Column(String(36), ForeignKey("categories.id"), nullable=False)
    name = Column(String(200), nullable=False)
    name_hindi = Column(String(200), nullable=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)
    brand = Column(String(100), default="AapnoKhet Pure")
    hsn_code = Column(String(20), default="1006") # Wheat: 1001, Rice: 1006, Pulses: 0713, Spices: 0910, Dairy: 0401
    gst_rate = Column(Float, default=5.0) # 0%, 5%, 12%
    origin = Column(String(100), default="Rajasthan, India")
    grade = Column(String(50), default="A Grade Pure")
    description = Column(Text, nullable=False)
    description_hindi = Column(Text, nullable=True)
    storage_tips = Column(Text, nullable=True)
    shelf_life_days = Column(Integer, default=180)
    is_perishable = Column(Boolean, default=False)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=now_utc)
    
    category = relationship("Category", back_populates="products")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")
    lab_reports = relationship("LabReport", back_populates="product")

class ProductVariant(Base):
    __tablename__ = "product_variants"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    pack_size = Column(String(50), nullable=False) # 1 kg, 5 kg, 25 kg, 50 kg, 15 kg tin, 1 L
    pack_weight_kg = Column(Float, default=25.0) # For logistics payload calc
    unit = Column(String(20), default="kg") # kg, L, tin, bag
    base_price = Column(Float, nullable=False) # INR per unit/pack
    moq = Column(Integer, default=1)
    active = Column(Boolean, default=True)
    
    product = relationship("Product", back_populates="variants")
    slabs = relationship("PriceSlab", back_populates="variant", cascade="all, delete-orphan")
    batches = relationship("Batch", back_populates="variant")

class PriceSlab(Base):
    __tablename__ = "price_slabs"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False)
    min_qty = Column(Integer, nullable=False)
    max_qty = Column(Integer, nullable=False)
    slab_price = Column(Float, nullable=False) # INR
    effective_from = Column(DateTime, default=now_utc)
    
    variant = relationship("ProductVariant", back_populates="slabs")

class CustomerPrice(Base):
    __tablename__ = "customer_prices"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False)
    custom_price = Column(Float, nullable=False)
    valid_till = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=now_utc)

class Warehouse(Base):
    __tablename__ = "warehouses"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(150), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), default="Jaipur")
    state = Column(String(100), default="Rajasthan")
    pincode = Column(String(10), nullable=False)
    cold_storage_enabled = Column(Boolean, default=True)
    
    batches = relationship("Batch", back_populates="warehouse")

class Batch(Base):
    __tablename__ = "batches"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False)
    warehouse_id = Column(String(36), ForeignKey("warehouses.id"), nullable=False)
    batch_no = Column(String(100), unique=True, index=True, nullable=False)
    mfg_date = Column(Date, nullable=False)
    expiry_date = Column(Date, nullable=False) # For FEFO sorting
    qty_available = Column(Integer, default=0)
    qty_reserved = Column(Integer, default=0)
    qc_status = Column(String(30), default="PASSED") # PENDING, PASSED, FAILED
    created_at = Column(DateTime, default=now_utc)
    
    variant = relationship("ProductVariant", back_populates="batches")
    warehouse = relationship("Warehouse", back_populates="batches")
    lab_report = relationship("LabReport", uselist=False, back_populates="batch")
    movements = relationship("StockMovement", back_populates="batch")

class LabReport(Base):
    __tablename__ = "lab_reports"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    batch_id = Column(String(36), ForeignKey("batches.id"), nullable=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    lab_name = Column(String(200), default="National Food Laboratory / FSSAI Accredited")
    report_no = Column(String(100), nullable=False)
    report_url = Column(String(500), nullable=False)
    tested_on = Column(Date, nullable=False)
    parameters = Column(JSON, default=dict) # e.g. {"moisture_pct": 11.2, "foreign_matter_pct": 0.05, "purity": "100% Certified"}
    result = Column(String(50), default="COMPLIANT_PURE")
    
    batch = relationship("Batch", back_populates="lab_report")
    product = relationship("Product", back_populates="lab_reports")

class StockMovement(Base):
    __tablename__ = "stock_movements"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    batch_id = Column(String(36), ForeignKey("batches.id"), nullable=False)
    movement_type = Column(String(30), nullable=False) # INWARD, OUTWARD, RESERVATION, RELEASE, ADJUSTMENT
    qty = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=True)
    done_by_user_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    batch = relationship("Batch", back_populates="movements")

class StockReservation(Base):
    __tablename__ = "stock_reservations"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), nullable=False)
    batch_id = Column(String(36), ForeignKey("batches.id"), nullable=False)
    qty = Column(Integer, nullable=False)
    status = Column(String(30), default="ACTIVE") # ACTIVE, CONVERTED, RELEASED
    expires_at = Column(DateTime, nullable=False) # 30 min TTL

# ----------------- CART & ORDERS -----------------
class Cart(Base):
    __tablename__ = "carts"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    updated_at = Column(DateTime, default=now_utc)
    
    user = relationship("User", back_populates="cart")
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

class CartItem(Base):
    __tablename__ = "cart_items"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    cart_id = Column(String(36), ForeignKey("carts.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False)
    qty = Column(Integer, default=1)
    
    cart = relationship("Cart", back_populates="items")
    variant = relationship("ProductVariant")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_no = Column(String(50), unique=True, index=True, nullable=False)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    placed_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    address_id = Column(String(36), ForeignKey("addresses.id"), nullable=False)
    status = Column(String(50), default="CONFIRMED") # CONFIRMED, PACKED, DISPATCHED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    subtotal = Column(Float, nullable=False)
    tax_total = Column(Float, nullable=False) # CGST + SGST or IGST
    delivery_fee = Column(Float, default=0.0)
    grand_total = Column(Float, nullable=False)
    payment_mode = Column(String(50), default="CREDIT") # CREDIT, ONLINE_UPI, COD
    payment_status = Column(String(50), default="PENDING") # PENDING, PAID, REFUNDED
    delivery_date = Column(Date, nullable=False)
    delivery_slot = Column(String(100), default="Morning 6 AM - 10 AM")
    special_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    company = relationship("Company", back_populates="orders")
    placed_by_user = relationship("User", back_populates="orders")
    address = relationship("Address")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    invoice = relationship("Invoice", uselist=False, back_populates="order")
    delivery = relationship("Delivery", uselist=False, back_populates="order")
    status_history = relationship("OrderStatusHistory", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    variant_id = Column(String(36), ForeignKey("product_variants.id"), nullable=False)
    batch_id = Column(String(36), ForeignKey("batches.id"), nullable=True) # allocated batch via FEFO
    qty = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    tax_rate = Column(Float, default=5.0)
    tax_amount = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    
    order = relationship("Order", back_populates="items")
    variant = relationship("ProductVariant")
    batch = relationship("Batch")

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    status = Column(String(50), nullable=False)
    notes = Column(Text, nullable=True)
    changed_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    order = relationship("Order", back_populates="status_history")

# ----------------- PAYMENTS & LEDGER -----------------
class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=False)
    gateway_txn_id = Column(String(100), unique=True, index=True, nullable=True)
    mode = Column(String(50), default="UPI")
    amount = Column(Float, nullable=False)
    status = Column(String(30), default="SUCCESS")
    paid_at = Column(DateTime, default=now_utc)

class Invoice(Base):
    __tablename__ = "invoices"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), unique=True, nullable=False)
    invoice_no = Column(String(50), unique=True, index=True, nullable=False)
    financial_year = Column(String(20), default="2026-27")
    irn = Column(String(100), nullable=True) # e-invoice IRN hash
    subtotal = Column(Float, nullable=False)
    cgst = Column(Float, default=0.0)
    sgst = Column(Float, default=0.0)
    igst = Column(Float, default=0.0)
    grand_total = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    pdf_url = Column(String(500), nullable=True)
    status = Column(String(30), default="ISSUED") # ISSUED, PAID, PARTIAL, CANCELLED
    created_at = Column(DateTime, default=now_utc)
    
    order = relationship("Order", back_populates="invoice")
    credit_notes = relationship("CreditNote", back_populates="invoice")

class CreditNote(Base):
    __tablename__ = "credit_notes"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    invoice_id = Column(String(36), ForeignKey("invoices.id"), nullable=False)
    credit_note_no = Column(String(50), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    reason = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=now_utc)
    
    invoice = relationship("Invoice", back_populates="credit_notes")

class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    entry_type = Column(String(20), nullable=False) # DEBIT (increases debt), CREDIT (decreases debt)
    debit = Column(Float, default=0.0)
    credit = Column(Float, default=0.0)
    balance_after = Column(Float, default=0.0)
    ref_type = Column(String(50), nullable=False) # INVOICE, PAYMENT, CREDIT_NOTE
    ref_id = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=now_utc)
    
    company = relationship("Company", back_populates="ledger_entries")

# ----------------- LOGISTICS & DELIVERY -----------------
class Vehicle(Base):
    __tablename__ = "vehicles"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    reg_no = Column(String(30), unique=True, nullable=False) # e.g. RJ14 GC 1234
    vehicle_type = Column(String(50), default="Bolero Maxi Truck")
    is_refrigerated = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)

class Driver(Base):
    __tablename__ = "drivers"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), nullable=True)
    name = Column(String(150), nullable=False)
    mobile = Column(String(20), nullable=False)
    license_no = Column(String(50), nullable=False)
    is_active = Column(Boolean, default=True)

class Delivery(Base):
    __tablename__ = "deliveries"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    order_id = Column(String(36), ForeignKey("orders.id"), unique=True, nullable=False)
    vehicle_id = Column(String(36), ForeignKey("vehicles.id"), nullable=True)
    driver_id = Column(String(36), ForeignKey("drivers.id"), nullable=True)
    status = Column(String(50), default="ASSIGNED") # ASSIGNED, PACKED, DISPATCHED, OUT_FOR_DELIVERY, DELIVERED, FAILED
    eta = Column(DateTime, nullable=True)
    run_sheet_no = Column(String(50), nullable=True)
    eway_bill_no = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=now_utc)
    
    order = relationship("Order", back_populates="delivery")
    vehicle = relationship("Vehicle")
    driver = relationship("Driver")
    pod = relationship("ProofOfDelivery", uselist=False, back_populates="delivery")

class ProofOfDelivery(Base):
    __tablename__ = "proof_of_deliveries"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    delivery_id = Column(String(36), ForeignKey("deliveries.id"), unique=True, nullable=False)
    otp_code = Column(String(6), nullable=False)
    otp_verified = Column(Boolean, default=False)
    photo_url = Column(String(500), nullable=True)
    signature_url = Column(String(500), nullable=True)
    receiver_name = Column(String(150), nullable=True)
    verified_at = Column(DateTime, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    
    delivery = relationship("Delivery", back_populates="pod")

# ----------------- SUPPORT & TICKETS -----------------
class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    company_id = Column(String(36), ForeignKey("companies.id"), nullable=False)
    order_id = Column(String(36), ForeignKey("orders.id"), nullable=True)
    ticket_type = Column(String(50), default="QUALITY_DEFECT") # QUALITY_DEFECT, SHORT_DELIVERY, BILLING, OTHER
    subject = Column(String(255), nullable=False)
    status = Column(String(30), default="OPEN") # OPEN, IN_REVIEW, RESOLVED, CLOSED
    priority = Column(String(20), default="HIGH") # LOW, MEDIUM, HIGH, URGENT
    created_at = Column(DateTime, default=now_utc)

class TicketMessage(Base):
    __tablename__ = "ticket_messages"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    ticket_id = Column(String(36), ForeignKey("tickets.id"), nullable=False)
    sender_id = Column(String(36), nullable=False)
    sender_name = Column(String(100), nullable=False)
    body = Column(Text, nullable=False)
    attachment_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=now_utc)

# ----------------- ADMIN CMS, SETTINGS & AI HELPER -----------------
class Page(Base):
    __tablename__ = "pages"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    content_html = Column(Text, nullable=True)
    seo_title = Column(String(200), nullable=True)
    seo_description = Column(String(300), nullable=True)
    status = Column(String(30), default="LIVE") # DRAFT, IN_REVIEW, LIVE, HIDDEN
    updated_at = Column(DateTime, default=now_utc)

class PageSection(Base):
    __tablename__ = "page_sections"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    page_slug = Column(String(100), default="home")
    kind = Column(String(50), nullable=False) # hero_banner, top_categories, order_again, deals, notice_bar
    sort_order = Column(Integer, default=0)
    visible = Column(Boolean, default=True)
    title = Column(String(200), nullable=True)
    settings_json = Column(JSON, default=dict)

class Banner(Base):
    __tablename__ = "banners"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(200), nullable=False)
    tagline = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=False)
    mobile_image_url = Column(String(500), nullable=True)
    link_url = Column(String(500), default="/catalog")
    starts_at = Column(DateTime, nullable=True)
    ends_at = Column(DateTime, nullable=True)
    visible = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

class DeliveryZone(Base):
    __tablename__ = "delivery_zones"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False) # e.g. Jaipur Central, Mansarovar, Vaishali Nagar
    pincodes = Column(Text, nullable=False) # Comma-separated: 302001, 302002, 302020
    delivery_fee = Column(Float, default=150.0)
    free_delivery_above = Column(Float, default=3000.0)
    min_order_amount = Column(Float, default=1000.0)
    is_active = Column(Boolean, default=True)

class TimeSlot(Base):
    __tablename__ = "time_slots"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    slot_label = Column(String(100), nullable=False) # e.g. Morning (06:00 AM - 10:00 AM)
    start_time = Column(String(10), default="06:00")
    end_time = Column(String(10), default="10:00")
    cutoff_time = Column(String(10), default="21:00") # Must order before 9 PM day prior
    cold_chain_ok = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)

class Setting(Base):
    __tablename__ = "settings"
    
    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=now_utc)

class AiRequest(Base):
    __tablename__ = "ai_requests"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), nullable=False)
    user_name = Column(String(100), nullable=False)
    purpose = Column(String(50), nullable=False) # product_description, banner, sms, faq
    input_facts = Column(Text, nullable=False)
    generated_text = Column(Text, nullable=False)
    status = Column(String(30), default="DRAFT") # DRAFT, APPROVED, PUBLISHED
    created_at = Column(DateTime, default=now_utc)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), nullable=True)
    user_email = Column(String(150), nullable=True)
    action = Column(String(100), nullable=False) # PRICE_CHANGE, STOCK_ADJUST, KYB_APPROVE, ROLE_CHANGE
    entity = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=False)
    before_state = Column(JSON, nullable=True)
    after_state = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    timestamp = Column(DateTime, default=now_utc)
