"""Projects service — import, list, and manage projects."""

from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Project


async def import_project(
    db: AsyncSession,
    user_id: str,
    name: str,
    source: str,
) -> Project:
    """Import a project from a filesystem path."""
    source_path = Path(source).resolve()

    if not source_path.exists():
        raise FileNotFoundError(f"Project path does not exist: {source_path}")

    # Read requirements.txt if present
    dep_file_content = None
    req_path = source_path / "requirements.txt"
    if req_path.exists():
        dep_file_content = req_path.read_text(encoding="utf-8")

    # Count Python files
    py_files = list(source_path.rglob("*.py"))
    file_count = len(py_files)

    project = Project(
        user_id=user_id,
        name=name,
        source=str(source_path),
        language="python",
        dep_file=dep_file_content,
        file_count=file_count,
        status="imported",
    )
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project


async def get_user_projects(db: AsyncSession, user_id: str) -> list[Project]:
    """Get all projects for a user."""
    result = await db.execute(
        select(Project).where(Project.user_id == user_id).order_by(Project.created_at.desc())
    )
    return list(result.scalars().all())


async def get_project_by_id(db: AsyncSession, project_id: str, user_id: str) -> Project | None:
    """Get a project by ID, scoped to a user."""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == user_id)
    )
    return result.scalar_one_or_none()
