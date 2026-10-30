"""Main FastAPI application entry point for VERYNTH."""

from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.analysis.router import router as analysis_router
from app.auth.dependencies import get_current_user
from app.auth.router import router as auth_router
from app.database import get_db, init_db
from app.migrations.router import router as migrations_router
from app.models import Dependency, Migration, Project, User
from app.projects.router import router as projects_router
from app.schemas import HistoryItem
from app.verification.router import router as verifications_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database tables on startup."""
    await init_db()
    yield


app = FastAPI(
    title="VERYNTH API",
    description="Intelligent Software Evolution — Dependency Migration & Verification Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(analysis_router)
app.include_router(migrations_router)
app.include_router(verifications_router)


@app.get("/api/history", response_model=list[HistoryItem], tags=["history"])
async def get_history(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get migration history across all projects for the current user."""
    # Join Migration with Project and Dependency to get full history details
    query = (
        select(Migration, Project, Dependency)
        .join(Project, Migration.project_id == Project.id)
        .outerjoin(Dependency, Migration.dependency_id == Dependency.id)
        .where(Project.user_id == current_user.id)
        .order_by(Migration.created_at.desc())
    )
    result = await db.execute(query)
    rows = result.all()

    items: list[HistoryItem] = []
    for migration, project, dependency in rows:
        items.append(
            HistoryItem(
                id=migration.id,
                project_name=project.name,
                dependency_name=dependency.name if dependency else "unknown",
                from_version=migration.from_version,
                to_version=migration.to_version,
                status=migration.status,
                created_at=migration.created_at,
            )
        )
    return items


@app.get("/health", tags=["system"])
@app.get("/api/health", tags=["system"])
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "VERYNTH Backend",
        "version": "1.0.0",
    }
