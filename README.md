# AapnoKhet — Pure Food Supply Chain B2B Platform

> **Business Model:** Pure Food B2B Direct-Supply (AapnoKhet is the sole seller; no third-party vendor signup)  
> **Target Audience:** Restaurants, Hotels, Caterers, Cloud Kitchens in India  
> **Stack:** Python 3.14 (FastAPI + SQLAlchemy + Pydantic) Backend + Next.js (`next@latest` + TypeScript + Tailwind CSS) Frontend  
> **Source Baseline:** [PRD v1.0 (`prd (3).md`)](file:///c:/Users/Dell/Desktop/Aapnokhet.com/prd%20(3).md) & [Master Implementation Plan](file:///c:/Users/Dell/Desktop/Aapnokhet.com/implementation_plan.md)

---

## 1. System Architecture & Phase Coverage

| PRD Section | Implemented Module | Technical Implementation |
|---|---|---|
| **5.1 & 5B.2** | **Authentication & RBAC** | JWT httpOnly tokens, password hashing, and role checks across 9 roles (`Super Admin`, `Content Manager`, `Catalog Manager`, `Warehouse Manager`, `Sales Manager`, `Dispatch Manager`, `Delivery Agent`, `Finance`, `Buyer Owner`, `Buyer Staff`). |
| **5.2** | **Restaurant KYB & Outlets** | GSTIN, PAN, and FSSAI capture; document verification workflow; multi-outlet branch addresses with delivery zone pincode serviceability checks. |
| **5.3** | **Commercial Catalog & Purity** | 5 core categories (Flour, Rice, Pulses, Spices, Dairy); pack sizes (25kg, 50kg, 15kg tin); and NABL/FSSAI laboratory inspection certificate modal (moisture %, pesticide residue, purity check). |
| **5.4** | **Multi-Tier Pricing Engine** | Hierarchy: Customer Negotiated Rate $\rightarrow$ Volume Tier Slabs $\rightarrow$ Base Variant Price. Indian GST computation (CGST+SGST vs IGST) with server-side price calculation preventing client tampering. |
| **5.7** | **Inventory & FEFO Batches** | Warehouse lot tracking, Goods Inward Note (GRN) QC gate, strictly sorted **FEFO (First-Expiry-First-Out)** allocation algorithm, and 30-day near-expiry automated alerts. |
| **5.5** | **Cart, Orders & 1-Click Reorder** | Persistent cart, MOQ rules, stock reservation with 30-min TTL, sub-user spend approvals, and **1-Click Reorder** cloning past orders into cart. |
| **5.6** | **Payments & B2B Credit Ledger** | Net 15 credit terms enforcement against approved credit limits, Razorpay UPI intent creation, webhook HMAC signature verification, and customer double-entry ledger. |
| **5.8** | **Fulfillment & Driver PWA** | Warehouse pick lists, delivery run sheets, vehicle cold-chain enforcement for dairy products, and mobile Driver PWA with OTP-verified Proof of Delivery (POD). |
| **5.9** | **GST Tax Invoices & Credit Notes** | Sequential FY invoices (e.g. `INV/26-10/4521`), HSN-wise tax breakdown table, and credit note adjustments. |
| **5B** | **Admin Console & Visual CMS** | Operations dashboard with real-time GMV, order volume, live section reordering, banner manager, and system settings. |
| **5C** | **AI Writing Helper Engine** | In-house generator strictly following Section 5C rules: warm shopkeeper tone, grade-school vocabulary, **NO DASHES RULE** (removes `-` and `—`), banned unproven claim filters, and human-in-the-loop review. |

---

## 2. Quick Start & Execution Guide

### Option A: 1-Click Launch (Windows)
Double-click [`start_all.bat`](file:///c:/Users/Dell/Desktop/Aapnokhet.com/start_all.bat) to launch both services concurrently:
- **Backend Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Frontend Web Portal:** [http://localhost:3000](http://localhost:3000)

### Option B: Manual Terminal Execution

#### 1. Backend (FastAPI):
```bash
cd backend
python app/db/seed.py      # Seeds master database with categories, products, batches, and users
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend (Next.js):
```bash
cd frontend
npm run dev
```

---

## 3. Demo Credentials

### Internal Operations Team:
- **Super Admin:** `admin@aapnokhet.com` / `Admin@123`
- **Catalog Manager:** `catalog@aapnokhet.com` / `Staff@123`
- **Warehouse Manager:** `warehouse@aapnokhet.com` / `Staff@123`
- **Sales Manager:** `sales@aapnokhet.com` / `Staff@123`
- **Dispatch Manager:** `dispatch@aapnokhet.com` / `Staff@123`
- **Delivery Agent:** `driver@aapnokhet.com` / `Staff@123`
- **Finance Lead:** `finance@aapnokhet.com` / `Staff@123`

### Sample Restaurant Buyer (Rawat Sweets):
- **Buyer Owner:** `owner@rawatrestaurant.com` / `Buyer@123`
  - Approved Credit Line: ₹2,50,000 (Net 15 Days)
  - GSTIN: `08AABCR1234F1Z1` &bull; FSSAI: `12224026000456`
- **Head Chef (Buyer Staff):** `chef@rawatrestaurant.com` / `Buyer@123`
  - Allocated Spend Limit: ₹75,000 per order

---

## 4. Automated Verification Results

The automated smoke test suite in [`backend/tests/test_api_smoke.py`](file:///c:/Users/Dell/Desktop/Aapnokhet.com/backend/tests/test_api_smoke.py) validates all core modules:
```
backend/tests/test_api_smoke.py::test_health PASSED                      [ 12%]
backend/tests/test_api_smoke.py::test_buyer_login PASSED                 [ 25%]
backend/tests/test_api_smoke.py::test_admin_login PASSED                 [ 37%]
backend/tests/test_api_smoke.py::test_catalog_products PASSED            [ 50%]
backend/tests/test_api_smoke.py::test_fefo_batches_ordering PASSED       [ 62%]
backend/tests/test_api_smoke.py::test_pricing_calculation PASSED         [ 75%]
backend/tests/test_api_smoke.py::test_ai_helper_no_dashes_rule PASSED    [ 87%]
backend/tests/test_api_smoke.py::test_home_cms_layout PASSED             [100%]
======================== 8 passed in 3.43s =========================
```

The Next.js production build (`npm run build`) completed with 0 errors:
```
✓ Compiled successfully in 20.0s
  Running TypeScript ...
  Finished TypeScript in 7.9s ...
✓ Generating static pages (4/4) in 900ms
```
