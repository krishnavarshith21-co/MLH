"""Verification API router (mainly handled via migrations router, but provides direct access)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import Migration, Project, User, Verification
from app.schemas import VerificationResponse

router = APIRouter(prefix="/api/verifications", tags=["verification"])


@router.get("/{verification_id}", response_model=VerificationResponse)
async def get_verification(
    verification_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific verification result."""
    result = await db.execute(
        select(Verification).where(Verification.id == verification_id)
    )
    verification = result.scalar_one_or_none()
    if not verification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Verification not found")

    # Verify ownership through migration → project chain
    mig_result = await db.execute(
        select(Migration).where(Migration.id == verification.migration_id)
    )
    migration = mig_result.scalar_one_or_none()
    if migration:
        proj_result = await db.execute(
            select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
        )
        if not proj_result.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Verification not found")

    return VerificationResponse.model_validate(verification)
