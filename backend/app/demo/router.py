"""Demo API router — endpoints for trial session, presentation data, reset, and AI model health."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.auth.service import create_access_token
from app.config import get_settings
from app.database import get_db
from app.demo.service import (
    ensure_demo_account,
    get_ai_status,
    get_presentation_data,
    reset_demo,
)
from app.models import User
from app.schemas import AuthResponse, MessageResponse, UserResponse

settings = get_settings()
router = APIRouter(prefix="/api/demo", tags=["demo"])


@router.post("/session", response_model=AuthResponse)
async def start_demo_session(db: AsyncSession = Depends(get_db)):
    """
    Start a demonstration session.
    Only available when ENABLE_DEMO_MODE is true in configuration.
    Ensures the demo user and pre-seeded sample projects exist and issues a valid JWT.
    """
    if not settings.ENABLE_DEMO_MODE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Demonstration mode is disabled in this environment.",
        )

    user = await ensure_demo_account(db)
    token = create_access_token(user.id)

    return AuthResponse(
        token=token,
        user=UserResponse.model_validate(user),
    )


@router.get("/ai-status")
async def check_ai_status() -> dict[str, Any]:
    """Check connectivity to Ollama and verify open-weight Qwen2.5-Coder model status."""
    return await get_ai_status()


@router.get("/presentation-data")
async def get_demo_presentation_data(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, Any]:
    """Retrieve verified metrics and project status for presentation view."""
    return await get_presentation_data(db, current_user.id)


@router.post("/reset", response_model=MessageResponse)
async def reset_demo_environment(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Transactionally reset demonstration projects, clearing temporary migrations
    and restoring sample-project files back to baseline.
    Protected to demo accounts only.
    """
    if current_user.email != settings.DEMO_USER_EMAIL and not current_user.is_demo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Reset operation is restricted to demonstration accounts.",
        )

    result = await reset_demo(db, current_user.id)
    return MessageResponse(
        message="Demo environment reset successfully",
        detail=result.get("message", "Reset complete"),
    )

