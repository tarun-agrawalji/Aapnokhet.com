import sys
import os
from datetime import datetime, date, timedelta, timezone

# Add backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from app.core.database import sync_engine, Base, SyncSessionLocal
from app.core.security import get_password_hash
from app.models.entities import (
    Company, User, Address, CreditAccount, Category, Product, ProductVariant,
    PriceSlab, Warehouse, Batch, LabReport, Vehicle, Driver, DeliveryZone,
    TimeSlot, PageSection, Banner, Setting
)

def seed():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=sync_engine)

    session = SyncSessionLocal()
    try:
        # Check if already seeded
        admin_check = session.query(User).filter_by(email="admin@aapnokhet.com").first()
        if admin_check:
            print("Database already seeded. Skipping.")
            return

        print("Seeding AapnoKhet initial master data...")

        # 1. Internal Team & Roles
        internal_users = [
            ("Super Admin", "AapnoKhet Admin", "admin@aapnokhet.com", "9829011111", "Admin@123"),
            ("Content Manager", "Ravi Content Lead", "content@aapnokhet.com", "9829022222", "Staff@123"),
            ("Catalog Manager", "Pooja Catalog Head", "catalog@aapnokhet.com", "9829033333", "Staff@123"),
            ("Warehouse Manager", "Mukesh Warehouse Lead", "warehouse@aapnokhet.com", "9829044444", "Staff@123"),
            ("Sales Manager", "Sanjay Sales Head", "sales@aapnokhet.com", "9829055555", "Staff@123"),
            ("Dispatch Manager", "Kailash Dispatch Lead", "dispatch@aapnokhet.com", "9829066666", "Staff@123"),
            ("Delivery Agent", "Raju Driver", "driver@aapnokhet.com", "9829077777", "Staff@123"),
            ("Finance", "Sunita Accounts Lead", "finance@aapnokhet.com", "9829088888", "Staff@123"),
            ("Support Agent", "Aman Support Lead", "support@aapnokhet.com", "9829099999", "Staff@123"),
        ]

        for role, name, email, mobile, pwd in internal_users:
            u = User(
                role_name=role,
                name=name,
                email=email,
                mobile=mobile,
                password_hash=get_password_hash(pwd),
                status="ACTIVE"
            )
            session.add(u)

        # 2. Sample Restaurant Buyer
        restaurant_company = Company(
            legal_name="Rawat Mishthan Bhandar Hospitality Pvt Ltd",
            trade_name="Rawat Sweets & Heritage Restaurant",
            gstin="08AABCR1234F1Z1",
            pan="AABCR1234F",
            fssai_no="12224026000456",
            business_type="Restaurant",
            kyb_status="APPROVED"
        )
        session.add(restaurant_company)
        session.flush()

        restaurant_owner = User(
            company_id=restaurant_company.id,
            role_name="Buyer Owner",
            name="Tarun Rawat (Owner)",
            email="owner@rawatrestaurant.com",
            mobile="9829000001",
            password_hash=get_password_hash("Buyer@123"),
            status="ACTIVE"
        )
        session.add(restaurant_owner)

        restaurant_chef = User(
            company_id=restaurant_company.id,
            role_name="Buyer Staff",
            name="Chef Mahendra (Head Chef)",
            email="chef@rawatrestaurant.com",
            mobile="9829000002",
            password_hash=get_password_hash("Buyer@123"),
            spend_limit=75000.0,
            status="ACTIVE"
        )
        session.add(restaurant_chef)

        # Restaurant Address & Credit Account
        restaurant_address = Address(
            company_id=restaurant_company.id,
            outlet_name="Main Station Road Kitchen",
            contact_person="Tarun Rawat",
            contact_phone="9829000001",
            line1="Plot 12, Station Road, Near Sindhi Camp",
            city="Jaipur",
            state="Rajasthan",
            pincode="302001",
            is_default=True
        )
        session.add(restaurant_address)

        credit_acc = CreditAccount(
            company_id=restaurant_company.id,
            credit_limit=250000.0,
            credit_days=15,
            outstanding=0.0,
            is_blocked=False
        )
        session.add(credit_acc)

        # 3. Master Categories
        cat_flour = Category(
            name="Wheat & Flours",
            slug="flour",
            description="Pure stone-ground whole wheat Sharbati atta, chakki fresh maida, sooji and besan.",
            image_url="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop",
            sort_order=1,
            is_perishable=False
        )
        cat_rice = Category(
            name="Rice & Grains",
            slug="rice",
            description="Aged royal 1121 Basmati rice, Sona Masoori, Kolam and daily cooking grains.",
            image_url="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop",
            sort_order=2,
            is_perishable=False
        )
        cat_pulses = Category(
            name="Pulses & Dals",
            slug="pulses",
            description="Unpolished native Toor, Chana, Moong, Urad and Masoor dals directly from farm mandis.",
            image_url="https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=600&auto=format&fit=crop",
            sort_order=3,
            is_perishable=False
        )
        cat_spices = Category(
            name="Whole & Ground Spices",
            slug="spices",
            description="High-curcumin Salem turmeric, Mathania red chilli, fragrant cumin, coriander and garam masala.",
            image_url="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop",
            sort_order=4,
            is_perishable=False
        )
        cat_dairy = Category(
            name="Pure Dairy & Ghee",
            slug="dairy",
            description="Daily fresh malai paneer, traditional bilona cow ghee, fresh mawa and curd under cold chain.",
            image_url="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=600&auto=format&fit=crop",
            sort_order=5,
            is_perishable=True
        )
        session.add_all([cat_flour, cat_rice, cat_pulses, cat_spices, cat_dairy])
        session.flush()

        # 4. Warehouse Setup
        wh_jaipur = Warehouse(
            name="AapnoKhet Central Warehouse Jaipur",
            address="Plot 42, Agro Food Park, RIICO Industrial Area, Mansarovar",
            city="Jaipur",
            state="Rajasthan",
            pincode="302020",
            cold_storage_enabled=True
        )
        session.add(wh_jaipur)
        session.flush()

        # 5. Products & Variants
        # Product 1: Sharbati Atta
        p_atta = Product(
            category_id=cat_flour.id,
            name="Sharbati Whole Wheat Atta (Chakki Fresh)",
            name_hindi="शरबती शुद्ध चक्की आटा",
            slug="sharbati-whole-wheat-atta",
            brand="AapnoKhet Pure",
            hsn_code="1101",
            gst_rate=0.0, # Atta unpackaged/loose or standard 0%
            origin="Sehore, Madhya Pradesh & Rajasthan",
            grade="Grade A+ Golden Grain",
            description="Stone ground chakki atta made from hand-sorted golden Sharbati wheat grains. Yields exceptionally soft, puffed rotis that stay fresh for over 8 hours.",
            description_hindi="शुद्ध शरबती गेहूं से पारंपरिक चक्की से पीसा गया आटा। रोटियां बेहद नरम और स्वादिष्ट बनती हैं।",
            storage_tips="Keep in dry, airtight container away from moisture.",
            shelf_life_days=90,
            is_perishable=False
        )
        session.add(p_atta)
        session.flush()

        v_atta_25 = ProductVariant(
            product_id=p_atta.id,
            sku="AK-ATTA-SHAR-25KG",
            pack_size="25 kg Bag",
            pack_weight_kg=25.0,
            unit="Bag",
            base_price=950.0, # ₹38/kg
            moq=2
        )
        v_atta_50 = ProductVariant(
            product_id=p_atta.id,
            sku="AK-ATTA-SHAR-50KG",
            pack_size="50 kg Bag",
            pack_weight_kg=50.0,
            unit="Bag",
            base_price=1850.0, # ₹37/kg
            moq=1
        )
        session.add_all([v_atta_25, v_atta_50])
        session.flush()

        # Slabs for Atta 50kg
        session.add_all([
            PriceSlab(variant_id=v_atta_50.id, min_qty=1, max_qty=4, slab_price=1850.0),
            PriceSlab(variant_id=v_atta_50.id, min_qty=5, max_qty=19, slab_price=1780.0),
            PriceSlab(variant_id=v_atta_50.id, min_qty=20, max_qty=100, slab_price=1720.0),
        ])

        # Product 2: Royal 1121 Basmati Rice
        p_rice = Product(
            category_id=cat_rice.id,
            name="1121 Royal Steam Basmati Rice (2-Year Aged)",
            name_hindi="1121 रॉयल बासमती चावल (२ वर्ष पुराना)",
            slug="1121-royal-steam-basmati-rice",
            brand="AapnoKhet Pure",
            hsn_code="1006",
            gst_rate=5.0,
            origin="Taraori, Haryana",
            grade="Extra Long Grain (8.35mm)",
            description="Naturally aged two-year steam basmati rice with distinctive floral aroma. Grains elongate up to 2.5 times on cooking without sticking. Perfect for royal dum biryanis and pulao.",
            storage_tips="Store in a cool and well-ventilated dry space.",
            shelf_life_days=720,
            is_perishable=False
        )
        session.add(p_rice)
        session.flush()

        v_rice_25 = ProductVariant(
            product_id=p_rice.id,
            sku="AK-RICE-BAS1121-25KG",
            pack_size="25 kg Bag",
            pack_weight_kg=25.0,
            unit="Bag",
            base_price=2450.0, # ₹98/kg
            moq=1
        )
        session.add(v_rice_25)
        session.flush()

        session.add_all([
            PriceSlab(variant_id=v_rice_25.id, min_qty=1, max_qty=3, slab_price=2450.0),
            PriceSlab(variant_id=v_rice_25.id, min_qty=4, max_qty=15, slab_price=2350.0),
            PriceSlab(variant_id=v_rice_25.id, min_qty=16, max_qty=100, slab_price=2250.0),
        ])

        # Product 3: Fresh Malai Paneer (Dairy, Perishable)
        p_paneer = Product(
            category_id=cat_dairy.id,
            name="Fresh Commercial Malai Paneer (Vacuum Pack)",
            name_hindi="ताज़ा मलाई पनीर (कमर्शियल पैक)",
            slug="fresh-commercial-malai-paneer",
            brand="AapnoKhet Dairy Pure",
            hsn_code="0406",
            gst_rate=5.0,
            origin="Jaipur Dairy Farm, Rajasthan",
            grade="Super Soft Premium Curd",
            description="Freshly made full cream buffalo milk paneer with high fat content (50%+ dry basis). Unmatched softness, non-rubbery texture ideal for paneer gravies and tandoori tikka.",
            storage_tips="Refrigerate at 2°C to 4°C immediately upon delivery.",
            shelf_life_days=10,
            is_perishable=True
        )
        session.add(p_paneer)
        session.flush()

        v_paneer_5 = ProductVariant(
            product_id=p_paneer.id,
            sku="AK-PANEER-MALAI-5KG",
            pack_size="5 kg Block",
            pack_weight_kg=5.0,
            unit="Block",
            base_price=1650.0, # ₹330/kg
            moq=1
        )
        session.add(v_paneer_5)
        session.flush()

        # Product 4: Unpolished Toor Dal
        p_toor = Product(
            category_id=cat_pulses.id,
            name="Unpolished Desi Toor Dal (Arhar Dal)",
            name_hindi="देसी अनपॉलिश्ड तुअर / अरहर दाल",
            slug="unpolished-desi-toor-dal",
            brand="AapnoKhet Pure",
            hsn_code="0713",
            gst_rate=0.0,
            origin="Gulbarga, Karnataka",
            grade="Grade A Unpolished",
            description="Pure unpolished toor dal with zero oil, water, or artificial coloring. High natural protein with authentic rich taste and fast boiling time.",
            storage_tips="Keep in cool, dry container.",
            shelf_life_days=180,
            is_perishable=False
        )
        session.add(p_toor)
        session.flush()

        v_toor_30 = ProductVariant(
            product_id=p_toor.id,
            sku="AK-DAL-TOOR-30KG",
            pack_size="30 kg Bag",
            pack_weight_kg=30.0,
            unit="Bag",
            base_price=4350.0, # ₹145/kg
            moq=1
        )
        session.add(v_toor_30)
        session.flush()

        # Product 5: Pure Cow Bilona Ghee
        p_ghee = Product(
            category_id=cat_dairy.id,
            name="Danedar Pure Cow Ghee (Bilona Method)",
            name_hindi="दानेदार शुद्ध गाय का देसी घी",
            slug="danedar-pure-cow-ghee-15kg",
            brand="AapnoKhet Pure",
            hsn_code="0405",
            gst_rate=12.0,
            origin="Tharparkar Cows, Rajasthan",
            grade="Pure Bilona Danedar",
            description="Prepared from curd using traditional wooden churn bilona process. Golden granular texture with rich earthy aroma and zero synthetic adulteration.",
            storage_tips="Keep in dry place away from sunlight. Do not refrigerate.",
            shelf_life_days=365,
            is_perishable=False
        )
        session.add(p_ghee)
        session.flush()

        v_ghee_15 = ProductVariant(
            product_id=p_ghee.id,
            sku="AK-GHEE-COW-15TIN",
            pack_size="15 kg Tin",
            pack_weight_kg=15.0,
            unit="Tin",
            base_price=9750.0, # ₹650/kg
            moq=1
        )
        session.add(v_ghee_15)
        session.flush()

        # 6. Seed Batches & Quality Lab Reports (FEFO Demonstration)
        today = date.today()
        batch_atta_1 = Batch(
            variant_id=v_atta_50.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-ATT-26A-01",
            mfg_date=today - timedelta(days=5),
            expiry_date=today + timedelta(days=85),
            qty_available=150,
            qty_reserved=0,
            qc_status="PASSED"
        )
        batch_atta_2 = Batch(
            variant_id=v_atta_50.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-ATT-26A-02",
            mfg_date=today - timedelta(days=20),
            expiry_date=today + timedelta(days=70), # Closer expiry, will allocate FIRST via FEFO
            qty_available=80,
            qty_reserved=0,
            qc_status="PASSED"
        )
        batch_rice_1 = Batch(
            variant_id=v_rice_25.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-RIC-26R-10",
            mfg_date=today - timedelta(days=60),
            expiry_date=today + timedelta(days=660),
            qty_available=200,
            qty_reserved=0,
            qc_status="PASSED"
        )
        batch_paneer_1 = Batch(
            variant_id=v_paneer_5.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-PAN-26D-05",
            mfg_date=today,
            expiry_date=today + timedelta(days=8),
            qty_available=50,
            qty_reserved=0,
            qc_status="PASSED"
        )
        batch_toor_1 = Batch(
            variant_id=v_toor_30.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-DAL-26T-04",
            mfg_date=today - timedelta(days=10),
            expiry_date=today + timedelta(days=170),
            qty_available=120,
            qty_reserved=0,
            qc_status="PASSED"
        )
        batch_ghee_1 = Batch(
            variant_id=v_ghee_15.id,
            warehouse_id=wh_jaipur.id,
            batch_no="LOT-GHE-26G-01",
            mfg_date=today - timedelta(days=15),
            expiry_date=today + timedelta(days=350),
            qty_available=40,
            qty_reserved=0,
            qc_status="PASSED"
        )
        session.add_all([batch_atta_1, batch_atta_2, batch_rice_1, batch_paneer_1, batch_toor_1, batch_ghee_1])
        session.flush()

        # Lab Reports
        rep_atta = LabReport(
            batch_id=batch_atta_1.id,
            product_id=p_atta.id,
            lab_name="Rajasthan State Food Testing Laboratory (FSSAI Reg # 1001)",
            report_no="LAB-RJ-2026-ATT-0491",
            report_url="https://example.com/reports/atta_sharbati_purity.pdf",
            tested_on=today - timedelta(days=4),
            parameters={
                "moisture_pct": 10.4,
                "foreign_matter_pct": 0.01,
                "gluten_pct": 11.2,
                "pesticide_residue": "NOT DETECTED",
                "adulteration": "NIL"
            },
            result="COMPLIANT_PURE"
        )
        rep_rice = LabReport(
            batch_id=batch_rice_1.id,
            product_id=p_rice.id,
            lab_name="Agri Quality Testing Council (NABL Accredited)",
            report_no="LAB-HR-2026-RIC-8832",
            report_url="https://example.com/reports/basmati_1121_lab_report.pdf",
            tested_on=today - timedelta(days=55),
            parameters={
                "grain_length_avg_mm": 8.38,
                "moisture_pct": 11.8,
                "purity_pct": 99.8,
                "broken_grain_pct": 0.5
            },
            result="COMPLIANT_PURE"
        )
        session.add_all([rep_atta, rep_rice])

        # 7. Logistics Fleet
        v1 = Vehicle(reg_no="RJ14 GC 4521", vehicle_type="Mahindra Bolero Maxi Truck (Standard)", is_refrigerated=False)
        v2 = Vehicle(reg_no="RJ14 GD 8899", vehicle_type="Tata Ace Cold Chain Refrigerated Van", is_refrigerated=True)
        session.add_all([v1, v2])

        d1 = Driver(name="Raju Gurjar", mobile="9829077777", license_no="RJ14-20180045123")
        d2 = Driver(name="Suresh Meena", mobile="9829077788", license_no="RJ14-20190089221")
        session.add_all([d1, d2])

        # 8. Delivery Zones & Time Slots
        z1 = DeliveryZone(
            name="Jaipur Central & Old City",
            pincodes="302001,302002,302003,302006,302016",
            delivery_fee=120.0,
            free_delivery_above=2500.0,
            min_order_amount=1000.0
        )
        z2 = DeliveryZone(
            name="Mansarovar & Vaishali Nagar Food Hub",
            pincodes="302020,302021,302019,302018",
            delivery_fee=150.0,
            free_delivery_above=3000.0,
            min_order_amount=1000.0
        )
        session.add_all([z1, z2])

        sl1 = TimeSlot(slot_label="Early Morning (06:00 AM - 09:30 AM)", start_time="06:00", end_time="09:30", cutoff_time="21:00", cold_chain_ok=True)
        sl2 = TimeSlot(slot_label="Mid-Day Prep (11:00 AM - 02:00 PM)", start_time="11:00", end_time="14:00", cutoff_time="08:00", cold_chain_ok=True)
        sl3 = TimeSlot(slot_label="Evening Dinner Slot (04:00 PM - 07:00 PM)", start_time="16:00", end_time="19:00", cutoff_time="13:00", cold_chain_ok=False)
        session.add_all([sl1, sl2, sl3])

        # 9. Home Page Layout Sections & Hero Banners
        sec1 = PageSection(page_slug="home", kind="notice_bar", sort_order=1, visible=True, title="Notice Bar", settings_json={"text": "🌾 Fresh Harvest Special: Direct Sharbati Atta & 1121 Basmati batch discounts for registered restaurants!"})
        sec2 = PageSection(page_slug="home", kind="hero_banner", sort_order=2, visible=True, title="Hero Showcase", settings_json={})
        sec3 = PageSection(page_slug="home", kind="order_again", sort_order=3, visible=True, title="Repeat Quick Order", settings_json={})
        sec4 = PageSection(page_slug="home", kind="top_categories", sort_order=4, visible=True, title="Raw Material Categories", settings_json={})
        sec5 = PageSection(page_slug="home", kind="deals", sort_order=5, visible=True, title="Today's Bulk Slabs", settings_json={})
        session.add_all([sec1, sec2, sec3, sec4, sec5])

        b1 = Banner(
            title="Pure Food Supplies Directly From Farm Mandis",
            tagline="Zero Middlemen. Lab-Tested Batches. GST Tax Invoices.",
            image_url="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&auto=format&fit=crop",
            link_url="/catalog",
            sort_order=1
        )
        b2 = Banner(
            title="Cold-Chain Certified Fresh Malai Paneer & Dairy",
            tagline="Delivered in temperature-controlled vans before 9:00 AM.",
            image_url="https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=1600&auto=format&fit=crop",
            link_url="/catalog?category=dairy",
            sort_order=2
        )
        session.add_all([b1, b2])

        # 10. Master System Settings
        session.add_all([
            Setting(key="free_delivery_threshold", value="3000", description="Order value above which delivery is free"),
            Setting(key="default_delivery_fee", value="150", description="Standard delivery fee in INR"),
            Setting(key="order_cutoff_evening", value="21:00", description="Evening cutoff for next day morning delivery"),
            Setting(key="seller_fssai_licence", value="12226999000845", description="AapnoKhet FSSAI License Number"),
            Setting(key="payment_modes_active", value="CREDIT,ONLINE_UPI,COD", description="Enabled payment options")
        ])

        session.commit()
        print("Master seed data created successfully!")

    except Exception as e:
        session.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        session.close()

if __name__ == "__main__":
    seed()
