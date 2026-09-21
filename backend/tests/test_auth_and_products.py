import uuid
import pytest
from httpx import ASGITransport, AsyncClient
from app.main import app


@pytest.mark.asyncio
async def test_auth_and_product_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        # 1. Test Login with Seed Admin
        login_res = await ac.post(
            "/api/v1/auth/login",
            json={"email": "admin@letoile.com", "password": "admin123"},
        )
        assert login_res.status_code == 200
        login_data = login_res.json()
        assert login_data["success"] is True
        admin_token = login_data["data"]["access_token"]
        assert admin_token is not None

        # 2. Test Get Current User /me
        me_res = await ac.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert me_res.status_code == 200
        assert me_res.json()["data"]["role"] == "ADMIN"

        # 3. Test Products List Endpoint
        prod_res = await ac.get("/api/v1/products?limit=5")
        assert prod_res.status_code == 200
        prod_data = prod_res.json()
        assert prod_data["success"] is True
        assert len(prod_data["data"]) > 0

        # 4. Test Customer Registration with Admin Approval Flow
        unique_email = f"neha.{uuid.uuid4().hex[:6]}@example.com"
        reg_res = await ac.post(
            "/api/v1/auth/register",
            json={
                "email": unique_email,
                "password": "password123",
                "full_name": "Neha Verma",
                "phone": "+91 99999 11111",
            },
        )
        assert reg_res.status_code == 201
        reg_data = reg_res.json()
        assert reg_data["data"]["is_approved"] is False
        new_user_id = reg_data["data"]["user"]["id"]

        # Attempt to login before approval -> Should be 403 Forbidden
        unapproved_login = await ac.post(
            "/api/v1/auth/login",
            json={"email": unique_email, "password": "password123"},
        )
        assert unapproved_login.status_code == 403

        # Admin Approves Customer
        approve_res = await ac.patch(
            f"/api/v1/admin/customers/{new_user_id}/approve",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert approve_res.status_code == 200
        assert approve_res.json()["success"] is True

        # Now login should succeed
        approved_login = await ac.post(
            "/api/v1/auth/login",
            json={"email": unique_email, "password": "password123"},
        )
        assert approved_login.status_code == 200
        customer_token = approved_login.json()["data"]["access_token"]
        assert customer_token is not None

        # 5. Test Order Placement
        order_res = await ac.post(
            "/api/v1/orders",
            headers={"Authorization": f"Bearer {customer_token}"},
            json={
                "customer_name": "Neha Verma",
                "customer_email": unique_email,
                "customer_phone": "+91 99999 11111",
                "delivery_address": "Apartment 101, Lakeview Residency",
                "delivery_city": "Bengaluru",
                "delivery_pincode": "560038",
                "delivery_date": "2026-09-15",
                "delivery_slot": "3:00 PM - 6:00 PM",
                "instructions": "Leave at front door",
                "payment_method": "RAZORPAY",
                "items": [
                    {
                        "product_id": "cake-1",
                        "product_name": "Belgian Dark Chocolate Ganache Truffle Cake",
                        "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
                        "price": 899.0,
                        "quantity": 1,
                        "flavour": "Belgian Chocolate",
                        "weight": "1.0 KG",
                        "is_eggless": True,
                        "custom_message": "Happy Birthday!",
                    }
                ],
            },
        )
        assert order_res.status_code == 201
        order_data = order_res.json()
        assert order_data["success"] is True
        assert order_data["data"]["order_number"].startswith("LET-")
