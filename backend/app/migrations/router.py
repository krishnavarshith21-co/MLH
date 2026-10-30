"""Migrations API router."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.dependencies import get_current_user
from app.config import get_settings
from app.database import get_db
from app.models import Dependency, Migration, Project, User, Verification
from app.migrations.service import (
    create_migration,
    get_migration_by_id,
    run_correction,
    run_generation,
)
from app.schemas import (
    HistoryItem,
    MigrationCreateRequest,
    MigrationReportResponse,
    MigrationResponse,
    VerificationResponse,
)

settings = get_settings()
router = APIRouter(prefix="/api/migrations", tags=["migrations"])


@router.post("", response_model=MigrationResponse, status_code=status.HTTP_201_CREATED)
async def create_migration_endpoint(
    body: MigrationCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new migration for a project dependency."""
    # Verify project ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == body.project_id, Project.user_id == current_user.id)
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    try:
        migration = await create_migration(db, body.project_id, body.dependency_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return MigrationResponse.model_validate(migration)


@router.get("/{migration_id}", response_model=MigrationResponse)
async def get_migration(
    migration_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific migration by ID."""
    migration = await get_migration_by_id(db, migration_id)
    if not migration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Verify ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    return MigrationResponse.model_validate(migration)


@router.post("/{migration_id}/generate", response_model=MigrationResponse)
async def generate_migration_endpoint(
    migration_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger AI code generation for a migration."""
    migration = await get_migration_by_id(db, migration_id)
    if not migration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Verify ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    migration = await run_generation(db, migration)
    return MigrationResponse.model_validate(migration)


@router.post("/{migration_id}/verify", response_model=VerificationResponse)
async def verify_migration_endpoint(
    migration_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run verification (pytest) on a migration. Triggers correction loop on failure."""
    migration = await get_migration_by_id(db, migration_id)
    if not migration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Verify ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    if not migration.migrated_code:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No migrated code to verify. Run /generate first.",
        )

    from app.verification.runner import run_verification
    from app.migrations.service import _parse_combined_source

    # Run verification
    verification = await run_verification(db, migration, project)

    # If failed and under max attempts, trigger correction loop
    if verification.status == "failed" and migration.attempts < settings.MAX_AI_CORRECTION_ATTEMPTS:
        migration = await run_correction(db, migration, verification.output or "")
        # Re-verify after correction
        verification = await run_verification(db, migration, project)

    return VerificationResponse.model_validate(verification)


@router.post("/{migration_id}/approve", response_model=MigrationResponse)
async def approve_migration_endpoint(
    migration_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Approve a verified migration."""
    migration = await get_migration_by_id(db, migration_id)
    if not migration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Verify ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    migration.status = "approved"
    await db.flush()
    await db.refresh(migration)
    return MigrationResponse.model_validate(migration)


@router.get("/{migration_id}/report", response_model=MigrationReportResponse)
async def get_migration_report(
    migration_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a full migration report including all verification attempts."""
    migration = await get_migration_by_id(db, migration_id)
    if not migration:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Verify ownership
    proj_result = await db.execute(
        select(Project).where(Project.id == migration.project_id, Project.user_id == current_user.id)
    )
    if not proj_result.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Migration not found")

    # Get all verifications
    ver_result = await db.execute(
        select(Verification)
        .where(Verification.migration_id == migration_id)
        .order_by(Verification.attempt_number)
    )
    verifications = ver_result.scalars().all()

    # Build summary
    total_attempts = len(verifications)
    passed_attempts = sum(1 for v in verifications if v.status == "passed")
    latest_status = verifications[-1].status if verifications else "no_verification"

    summary = {
        "total_attempts": total_attempts,
        "passed_attempts": passed_attempts,
        "latest_status": latest_status,
        "ai_model": migration.ai_model,
        "from_version": migration.from_version,
        "to_version": migration.to_version,
    }

    return MigrationReportResponse(
        migration=MigrationResponse.model_validate(migration),
        verifications=[VerificationResponse.model_validate(v) for v in verifications],
        summary=summary,
    )
