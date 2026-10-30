"""Analysis API router — trigger project analysis and retrieve dependencies."""

from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.analysis.analyzer import analyze_directory
from app.analysis.scanner import (
    check_breaking_changes,
    fetch_latest_version,
    parse_requirements,
)
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.models import Dependency, Project, User
from app.projects.service import get_project_by_id
from app.schemas import AnalysisIssue, AnalysisResponse, DependencyResponse

router = APIRouter(prefix="/api/projects", tags=["analysis"])


@router.post("/{project_id}/analyze", response_model=AnalysisResponse)
async def analyze_project(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Run dependency + AST analysis on a project."""
    project = await get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project.status = "analyzing"
    await db.flush()

    # ── Parse dependencies ────────────────────────────────────────────────
    dep_responses: list[DependencyResponse] = []
    if project.dep_file:
        parsed = parse_requirements(project.dep_file)
        for dep in parsed:
            latest = await fetch_latest_version(dep.name)
            is_outdated = False
            if dep.current_version and latest and dep.current_version != latest:
                is_outdated = True

            has_breaking = check_breaking_changes(dep.name, dep.current_version, latest)

            db_dep = Dependency(
                project_id=project.id,
                name=dep.name,
                current_version=dep.current_version,
                latest_version=latest,
                is_outdated=is_outdated,
                has_breaking_changes=has_breaking,
            )
            db.add(db_dep)
            await db.flush()
            await db.refresh(db_dep)
            dep_responses.append(DependencyResponse.model_validate(db_dep))

    # ── AST analysis ──────────────────────────────────────────────────────
    source_path = Path(project.source)
    issues_raw = analyze_directory(source_path)

    issues: list[AnalysisIssue] = []
    for issue in issues_raw:
        # Make file paths relative to project source for cleaner display
        try:
            rel_path = str(Path(issue.file).relative_to(source_path))
        except ValueError:
            rel_path = issue.file

        issues.append(
            AnalysisIssue(
                file=rel_path,
                line=issue.line,
                code=issue.code,
                function=issue.function,
                pattern=issue.pattern,
                suggestion=issue.suggestion,
            )
        )

    project.status = "analyzed"
    await db.flush()

    return AnalysisResponse(
        project_id=project.id,
        status=project.status,
        dependencies=dep_responses,
        issues=issues,
        file_count=project.file_count,
        total_issues=len(issues),
    )


@router.get("/{project_id}/dependencies", response_model=list[DependencyResponse])
async def get_project_dependencies(
    project_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all dependencies for a project."""
    project = await get_project_by_id(db, project_id, current_user.id)
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    from sqlalchemy import select
    result = await db.execute(
        select(Dependency).where(Dependency.project_id == project_id)
    )
    deps = result.scalars().all()
    return [DependencyResponse.model_validate(d) for d in deps]
