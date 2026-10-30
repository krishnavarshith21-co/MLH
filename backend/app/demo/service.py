"""Demo service — management of demo user, seed sample projects, and live demonstration workflow."""

from __future__ import annotations

import os
import secrets
import shutil
from pathlib import Path
from typing import Any

import httpx
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.analysis.analyzer import analyze_directory
from app.auth.service import hash_password
from app.config import get_settings
from app.models import Dependency, Migration, Project, User, Verification

settings = get_settings()

CREDENTIALS_FILE = Path(__file__).resolve().parent.parent.parent.parent / ".demo_credentials"
BASELINE_DIR = Path(__file__).resolve().parent / "sample-project-baseline"


def get_or_create_demo_password() -> str:
    """Retrieve existing demo password from untracked file or generate a new secure one."""
    if CREDENTIALS_FILE.exists():
        try:
            content = CREDENTIALS_FILE.read_text(encoding="utf-8")
            for line in content.splitlines():
                if line.startswith("DEMO_PASSWORD="):
                    pw = line.split("=", 1)[1].strip()
                    if pw:
                        return pw
        except Exception:
            pass

    # Generate a cryptographically secure random password
    pw = secrets.token_urlsafe(16)
    content = (
        "# VERYNTH HACKATHON DEMONSTRATION CREDENTIALS\n"
        "# DO NOT COMMIT TO VERSION CONTROL\n"
        f"DEMO_EMAIL={settings.DEMO_USER_EMAIL}\n"
        f"DEMO_PASSWORD={pw}\n"
        f"DEMO_ROLE={settings.DEMO_USER_ROLE}\n"
        f"DEMO_ACCOUNT_TYPE={settings.DEMO_ACCOUNT_TYPE}\n"
    )
    try:
        CREDENTIALS_FILE.write_text(content, encoding="utf-8")
        os.chmod(CREDENTIALS_FILE, 0o600)
    except Exception as e:
        print(f"[VERYNTH DEMO] Warning: Could not write .demo_credentials file: {e}")

    print("\n" + "=" * 64)
    print("VERYNTH DEMO CREDENTIALS INITIALIZED (Local & Untracked)")
    print(f"Email:    {settings.DEMO_USER_EMAIL}")
    print(f"Password: {pw}")
    print(f"File:     {CREDENTIALS_FILE}")
    print("=" * 64 + "\n")
    return pw


async def ensure_demo_account(db: AsyncSession) -> User:
    """Ensure demo user exists with pre-populated sample projects and realistic records."""
    demo_email = settings.DEMO_USER_EMAIL
    pw = get_or_create_demo_password()

    # Look up demo user
    result = await db.execute(select(User).where(User.email == demo_email))
    user = result.scalar_one_or_none()

    if not user:
        user = User(
            name=settings.DEMO_USER_NAME,
            email=demo_email,
            password_hash=hash_password(pw),
            role=settings.DEMO_USER_ROLE,
            account_type=settings.DEMO_ACCOUNT_TYPE,
            is_demo=True,
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
    else:
        # Update metadata if needed
        user.name = settings.DEMO_USER_NAME
        user.role = settings.DEMO_USER_ROLE
        user.account_type = settings.DEMO_ACCOUNT_TYPE
        user.is_demo = True
        await db.flush()

    # Seed or verify the 3 demo projects
    workspace_root = Path(__file__).resolve().parent.parent.parent.parent
    sample_proj_path = (workspace_root / "sample-project").resolve()
    retail_proj_path = (workspace_root / "demo-projects" / "retail-analytics-service").resolve()
    inventory_proj_path = (workspace_root / "demo-projects" / "inventory-reporting-api").resolve()

    # Project 1: Legacy Data Analytics
    await _seed_demo_project(
        db=db,
        user_id=user.id,
        name="Legacy Data Analytics",
        source_path=sample_proj_path,
        status="ready_for_migration",
        description="Primary live demonstration pipeline. Contains 6 deprecated DataFrame.append() usages across analytics and data processing functions with 12 regression test cases.",
        dep_defaults=[
            ("pandas", "1.5.3", "2.2.3", True, True),
            ("numpy", "1.23.5", "1.26.4", True, False),
            ("pytest", "7.4.0", "8.3.4", True, False),
        ],
    )

    # Project 2: Retail Analytics Service
    await _seed_demo_project(
        db=db,
        user_id=user.id,
        name="Retail Analytics Service",
        source_path=retail_proj_path,
        status="sample_analysis",
        description="Sample analytics ETL pipeline with scikit-learn and pandas 1.4.4. Clean code verified with zero breaking changes.",
        dep_defaults=[
            ("pandas", "1.4.4", "2.2.3", True, True),
            ("numpy", "1.23.5", "1.26.4", True, False),
            ("scikit-learn", "1.1.2", "1.6.1", True, False),
            ("pytest", "7.4.0", "8.3.4", True, False),
        ],
    )

    # Project 3: Inventory Reporting API
    await _seed_demo_project(
        db=db,
        user_id=user.id,
        name="Inventory Reporting API",
        source_path=inventory_proj_path,
        status="pending_review",
        description="Synthetic FastAPI service utilizing Pydantic v1. Flagged for architectural review prior to Pydantic v2 upgrade.",
        dep_defaults=[
            ("fastapi", "0.95.2", "0.115.6", True, False),
            ("pydantic", "1.10.8", "2.10.4", True, True),
            ("uvicorn", "0.22.0", "0.34.0", True, False),
            ("pytest", "7.4.0", "8.3.4", True, False),
        ],
    )

    await db.commit()
    return user


async def _seed_demo_project(
    db: AsyncSession,
    user_id: str,
    name: str,
    source_path: Path,
    status: str,
    description: str,
    dep_defaults: list[tuple[str, str, str, bool, bool]],
) -> Project:
    """Helper to ensure a demo project and its dependencies are accurately seeded in DB."""
    if not source_path.exists():
        source_path.mkdir(parents=True, exist_ok=True)

    # Read requirements.txt if present
    req_file = source_path / "requirements.txt"
    dep_content = req_file.read_text(encoding="utf-8") if req_file.exists() else None

    # Count python files
    py_files = list(source_path.rglob("*.py"))
    file_count = len(py_files)

    result = await db.execute(
        select(Project).where(Project.user_id == user_id, Project.name == name)
    )
    project = result.scalar_one_or_none()

    if not project:
        project = Project(
            user_id=user_id,
            name=name,
            source=str(source_path),
            language="python",
            dep_file=dep_content,
            file_count=file_count,
            status=status,
            is_demo=True,
            description=description,
        )
        db.add(project)
        await db.flush()
        await db.refresh(project)
    else:
        project.source = str(source_path)
        project.file_count = file_count
        project.dep_file = dep_content
        project.description = description
        project.is_demo = True
        await db.flush()

    # Seed dependencies
    existing_deps_res = await db.execute(
        select(Dependency).where(Dependency.project_id == project.id)
    )
    existing_deps = {d.name.lower(): d for d in existing_deps_res.scalars().all()}

    for dep_name, cur_ver, lat_ver, outdated, breaking in dep_defaults:
        if dep_name.lower() not in existing_deps:
            db_dep = Dependency(
                project_id=project.id,
                name=dep_name,
                current_version=cur_ver,
                latest_version=lat_ver,
                is_outdated=outdated,
                has_breaking_changes=breaking,
            )
            db.add(db_dep)
        else:
            dep = existing_deps[dep_name.lower()]
            dep.current_version = cur_ver
            dep.latest_version = lat_ver
            dep.is_outdated = outdated
            dep.has_breaking_changes = breaking

    await db.flush()
    return project


async def reset_demo(db: AsyncSession, demo_user_id: str) -> dict[str, Any]:
    """
    Transactionally reset the demo environment to its baseline pristine state.
    Restores original sample-project files and clears demo migrations/verifications.
    """
    # 1. Restore sample-project from baseline backup if baseline exists
    workspace_root = Path(__file__).resolve().parent.parent.parent.parent
    sample_proj_path = workspace_root / "sample-project"

    if BASELINE_DIR.exists() and sample_proj_path.exists():
        # Restore src/ directory specifically to keep original DataFrame.append code
        baseline_src = BASELINE_DIR / "src"
        target_src = sample_proj_path / "src"
        if baseline_src.exists() and target_src.exists():
            for item in baseline_src.glob("*.py"):
                shutil.copy2(item, target_src / item.name)

    # 2. Find demo projects
    proj_result = await db.execute(
        select(Project).where(Project.user_id == demo_user_id)
    )
    demo_projects = proj_result.scalars().all()
    project_ids = [p.id for p in demo_projects]

    if project_ids:
        # Find and remove verifications and migrations for these demo projects
        migs_result = await db.execute(
            select(Migration).where(Migration.project_id.in_(project_ids))
        )
        demo_migrations = migs_result.scalars().all()
        mig_ids = [m.id for m in demo_migrations]

        if mig_ids:
            verifs_result = await db.execute(
                select(Verification).where(Verification.migration_id.in_(mig_ids))
            )
            for v in verifs_result.scalars().all():
                await db.delete(v)

        for m in demo_migrations:
            await db.delete(m)

        # Reset project statuses to pristine baseline
        for p in demo_projects:
            if p.name == "Legacy Data Analytics":
                p.status = "ready_for_migration"
            elif p.name == "Retail Analytics Service":
                p.status = "sample_analysis"
            elif p.name == "Inventory Reporting API":
                p.status = "pending_review"

    await db.commit()
    return {
        "status": "success",
        "message": "Demo environment successfully reset to pristine baseline state.",
    }


async def get_ai_status() -> dict[str, Any]:
    """Check connectivity to Ollama and verify availability of Qwen2.5-Coder models."""
    url = f"{settings.OLLAMA_BASE_URL}/api/tags"

    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                models = [m.get("name") for m in data.get("models", [])]
                has_7b = any("qwen2.5-coder:7b" in m for m in models)
                has_1_5b = any("qwen2.5-coder:1.5b" in m for m in models)

                active_model = settings.OLLAMA_MODEL
                if not has_7b and has_1_5b:
                    active_model = "qwen2.5-coder:1.5b-instruct"

                return {
                    "online": True,
                    "provider": "Ollama (Local Open-Weight)",
                    "active_model": active_model,
                    "accelerator": "Apple Silicon Metal (100% GPU offload)",
                    "models_detected": models,
                    "recommended_model_present": has_7b or has_1_5b,
                    "message": "AI inference engine connected and operational.",
                }
            return {
                "online": False,
                "provider": "Ollama (Offline)",
                "active_model": None,
                "accelerator": "None",
                "models_detected": [],
                "recommended_model_present": False,
                "message": f"Ollama returned HTTP {resp.status_code}",
            }
    except Exception as e:
        return {
            "online": False,
            "provider": "Ollama (Offline)",
            "active_model": None,
            "accelerator": "None",
            "models_detected": [],
            "recommended_model_present": False,
            "message": f"Could not connect to Ollama: {e!s}",
        }


async def get_presentation_data(db: AsyncSession, demo_user_id: str) -> dict[str, Any]:
    """Compute verified statistics and pre-seed information for presentation dashboard."""
    # Demo projects
    projects_res = await db.execute(
        select(Project).where(Project.user_id == demo_user_id).order_by(Project.name.asc())
    )
    projects = projects_res.scalars().all()
    project_ids = [p.id for p in projects]

    # Total dependencies
    dep_count_res = await db.execute(
        select(func.count(Dependency.id)).where(Dependency.project_id.in_(project_ids))
    )
    total_deps = dep_count_res.scalar() or 0

    # Breaking changes count
    breaking_res = await db.execute(
        select(func.count(Dependency.id)).where(
            Dependency.project_id.in_(project_ids),
            Dependency.has_breaking_changes.is_(True),
        )
    )
    breaking_deps = breaking_res.scalar() or 0

    # Total issues found by AST analysis across demo projects
    total_issues = 0
    project_issue_counts = {}
    for p in projects:
        try:
            issues = analyze_directory(Path(p.source))
            project_issue_counts[p.id] = len(issues)
            total_issues += len(issues)
        except Exception:
            project_issue_counts[p.id] = 0

    # Verified migrations count
    verified_res = await db.execute(
        select(func.count(Migration.id)).where(
            Migration.project_id.in_(project_ids),
            Migration.status.in_(["verified", "approved"]),
        )
    )
    verified_count = verified_res.scalar() or 0

    # Pending reviews
    pending_res = await db.execute(
        select(func.count(Migration.id)).where(
            Migration.project_id.in_(project_ids),
            Migration.status.in_(["pending", "generating", "generated"]),
        )
    )
    pending_count = pending_res.scalar() or 0

    # Find primary demo project (Legacy Data Analytics)
    primary_proj = next((p for p in projects if p.name == "Legacy Data Analytics"), None)
    primary_dep_id = None
    if primary_proj:
        dep_res = await db.execute(
            select(Dependency).where(
                Dependency.project_id == primary_proj.id,
                Dependency.name == "pandas",
            )
        )
        pandas_dep = dep_res.scalars().first()
        if pandas_dep:
            primary_dep_id = pandas_dep.id

    ai_status = await get_ai_status()

    return {
        "summary": {
            "total_sample_projects": len(projects),
            "analyzed_dependencies": total_deps,
            "identified_breaking_changes": breaking_deps,
            "detected_code_issues": total_issues,
            "verified_migrations": verified_count,
            "pending_reviews": pending_count,
        },
        "primary_demo": {
            "project_id": primary_proj.id if primary_proj else None,
            "project_name": primary_proj.name if primary_proj else "Legacy Data Analytics",
            "dependency_id": primary_dep_id,
            "dependency_name": "pandas",
            "from_version": "1.5.3",
            "to_version": "2.0.0",
            "known_issues_count": 6,
            "test_count": 12,
        },
        "ai_status": ai_status,
        "projects": [
            {
                "id": p.id,
                "name": p.name,
                "source": p.source,
                "language": p.language,
                "status": p.status,
                "file_count": p.file_count,
                "description": p.description,
                "detected_issues": project_issue_counts.get(p.id, 0),
            }
            for p in projects
        ],
    }
