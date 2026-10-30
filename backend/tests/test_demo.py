"""Tests for VERYNTH demonstration environment and endpoints."""

from __future__ import annotations

import pytest
from httpx import ASGITransport, AsyncClient

from app.database import init_db
from app.demo.service import get_or_create_demo_password
from app.main import app


@pytest.mark.anyio
async def test_demo_credentials_generation():
    """Verify demo password generation and retrieval."""
    pw = get_or_create_demo_password()
    assert isinstance(pw, str)
    assert len(pw) >= 16


@pytest.mark.anyio
async def test_demo_session_endpoint():
    """Verify demo session endpoint issues a valid JWT with demo user metadata."""
    await init_db()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Start demo session
        resp = await client.post("/api/demo/session")
        assert resp.status_code == 200
        data = resp.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == "demo@verynth.local"
        assert data["user"]["role"] == "Demo User"
        assert data["user"]["account_type"] == "Hackathon Demonstration"
        assert data["user"]["is_demo"] is True

        token = data["token"]

        # Check /api/demo/presentation-data with demo token
        pres_resp = await client.get(
            "/api/demo/presentation-data",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert pres_resp.status_code == 200
        pres_data = pres_resp.json()
        assert "summary" in pres_data
        assert pres_data["summary"]["total_sample_projects"] >= 3
        assert "primary_demo" in pres_data
        assert pres_data["primary_demo"]["project_name"] == "Legacy Data Analytics"
        assert len(pres_data["projects"]) >= 3


@pytest.mark.anyio
async def test_demo_ai_status_endpoint():
    """Verify AI status endpoint reports connectivity."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        resp = await client.get("/api/demo/ai-status")
        assert resp.status_code == 200
        data = resp.json()
        assert "online" in data
        assert "provider" in data


@pytest.mark.anyio
async def test_demo_reset_endpoint():
    """Verify demo reset endpoint transactionally resets demonstration environment."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Get demo token
        session_resp = await client.post("/api/demo/session")
        token = session_resp.json()["token"]

        # Reset demo
        reset_resp = await client.post(
            "/api/demo/reset",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert reset_resp.status_code == 200
        assert reset_resp.json()["message"] == "Demo environment reset successfully"
