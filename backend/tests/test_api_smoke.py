import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_buyer_login():
    res = client.post("/api/v1/auth/login", json={
        "email_or_mobile": "owner@rawatrestaurant.com",
        "password": "Buyer@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "Buyer Owner"

def test_admin_login():
    res = client.post("/api/v1/auth/login", json={
        "email_or_mobile": "admin@aapnokhet.com",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "Super Admin"

def test_catalog_products():
    res = client.get("/api/v1/catalog/products")
    assert res.status_code == 200
    data = res.json()
    assert len(data) >= 5
    # Check that Sharbati Atta has purity certificate and variants
    atta = next((p for p in data if "Atta" in p["name"]), None)
    assert atta is not None
    assert len(atta["variants"]) >= 2
    assert atta["purity_certificate"] is not None

def test_fefo_batches_ordering():
    # Batches must be ordered by expiry_date ascending (closest expiry first)
    res = client.get("/api/v1/inventory/batches")
    assert res.status_code == 200
    batches = res.json()
    assert len(batches) >= 5
    expiries = [b["expiry_date"] for b in batches]
    assert expiries == sorted(expiries), "Batches are not strictly ordered by FEFO expiry date!"

def test_pricing_calculation():
    # Fetch first variant
    prod_res = client.get("/api/v1/catalog/products")
    first_var = prod_res.json()[0]["variants"][0]
    
    res = client.post("/api/v1/pricing/calculate", json={
        "items": [{"variant_id": first_var["id"], "qty": 10}],
        "pincode": "302001"
    })
    assert res.status_code == 200
    pricing = res.json()
    assert pricing["subtotal"] > 0
    assert "cgst" in pricing
    assert "sgst" in pricing
    assert pricing["grand_total"] >= pricing["subtotal"]

def test_ai_helper_no_dashes_rule():
    admin_login = client.post("/api/v1/auth/login", json={
        "email_or_mobile": "admin@aapnokhet.com",
        "password": "Admin@123"
    }).json()
    token = admin_login["access_token"]

    res = client.post(
        "/api/v1/ai-helper/generate",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "purpose": "product_short",
            "product_name": "Stone Ground Atta",
            "facts": "Hand sorted - pure grain — 100% pure - 25kg bag",
            "language": "English"
        }
    )
    assert res.status_code == 200
    data = res.json()
    # Check that dashes were removed
    assert "-" not in data["draft_text"]
    assert "—" not in data["draft_text"]
    assert data["has_dashes"] is False
    assert data["passes_rules"] is True

def test_home_cms_layout():
    res = client.get("/api/v1/cms/home-layout")
    assert res.status_code == 200
    data = res.json()
    assert len(data["sections"]) >= 4
    assert len(data["banners"]) >= 2
