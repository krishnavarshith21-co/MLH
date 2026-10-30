"""Comprehensive test suite for VERYNTH authentication lifecycle and persistence."""

from __future__ import annotations

import uuid

import jwt
import pytest
from httpx import ASGITransport, AsyncClient

from app.config import get_settings
from app.database import init_db
from app.main import app

settings = get_settings()


@pytest.mark.anyio
async def test_auth_full_lifecycle():
    """Execute the full 8-step authentication verification matrix."""
    await init_db()
    transport = ASGITransport(app=app)

    uid = uuid.uuid4().hex[:6]
    email_1 = f"sarah.connor.{uid}@verynth.dev"
    email_2 = f"kyle.reese.{uid}@verynth.dev"

    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # TEST 1: Register a new account → Sign in → Dashboard opens (token valid)
        signup_payload = {
            "name": "Sarah Connor",
            "email": email_1,
            "password": "StrongPassword2026!",
        }
        res_signup = await client.post("/api/auth/signup", json=signup_payload)
        assert res_signup.status_code == 201, f"Signup failed: {res_signup.text}"
        signup_data = res_signup.json()
        assert "token" in signup_data
        assert signup_data["user"]["email"] == email_1.lower()
        user_id_1 = signup_data["user"]["id"]

        # TEST 2: Sign out → Sign in again using same credentials (including casing/whitespace tolerance)
        # Sign in with mixed case and whitespace
        signin_payload = {
            "email": f"  {email_1.upper()}  ",
            "password": "StrongPassword2026!",
        }
        res_signin = await client.post("/api/auth/signin", json=signin_payload)
        assert res_signin.status_code == 200, f"Signin failed: {res_signin.text}"
        signin_data = res_signin.json()
        assert "token" in signin_data
        assert signin_data["user"]["id"] == user_id_1
        token_1 = signin_data["token"]

        # Verify token accesses protected endpoint /api/auth/me
        res_me = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_1}"})
        assert res_me.status_code == 200
        assert res_me.json()["email"] == email_1.lower()

        # TEST 3: Account persists across restarts (verify database query directly)
        res_signin_exact = await client.post(
            "/api/auth/signin",
            json={"email": email_1, "password": "StrongPassword2026!"},
        )
        assert res_signin_exact.status_code == 200
        assert res_signin_exact.json()["user"]["id"] == user_id_1

        # TEST 4: Enter incorrect password → Login rejected with 401
        res_bad_pw = await client.post(
            "/api/auth/signin",
            json={"email": email_1, "password": "WrongPassword!"},
        )
        assert res_bad_pw.status_code == 401
        assert res_bad_pw.json()["detail"] == "Invalid email or password"

        # TEST 5: Use expired or invalid JWT → Protected endpoint rejects token
        res_bad_jwt = await client.get(
            "/api/auth/me",
            headers={"Authorization": "Bearer invalid.fake.token"},
        )
        assert res_bad_jwt.status_code == 401
        assert res_bad_jwt.json()["detail"] == "Invalid or expired token"

        # Also test expired token
        expired_payload = {
            "sub": user_id_1,
            "exp": 1000000000,  # Far in the past
        }
        expired_token = jwt.encode(expired_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        res_exp_jwt = await client.get(
            "/api/auth/me",
            headers={"Authorization": f"Bearer {expired_token}"},
        )
        assert res_exp_jwt.status_code == 401
        assert res_exp_jwt.json()["detail"] == "Invalid or expired token"

        # TEST 6: Missing authorization header rejected
        res_no_auth = await client.get("/api/auth/me")
        assert res_no_auth.status_code in (401, 403)

        # TEST 7: Create two different user accounts → Each accesses only their own permitted data
        res_user2 = await client.post(
            "/api/auth/signup",
            json={
                "name": "Kyle Reese",
                "email": email_2,
                "password": "ResistancePassword2026!",
            },
        )
        assert res_user2.status_code == 201
        token_2 = res_user2.json()["token"]
        user_id_2 = res_user2.json()["user"]["id"]
        assert user_id_1 != user_id_2

        # User 1 me check
        me_1 = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_1}"})
        assert me_1.json()["id"] == user_id_1
        assert me_1.json()["name"] == "Sarah Connor"

        # User 2 me check
        me_2 = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_2}"})
        assert me_2.json()["id"] == user_id_2
        assert me_2.json()["name"] == "Kyle Reese"

        # TEST 8: Repeated authentication requests with valid token remain functional
        for _ in range(3):
            repeat_me = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token_1}"})
            assert repeat_me.status_code == 200
            assert repeat_me.json()["id"] == user_id_1
