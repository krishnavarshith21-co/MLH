"""Migrations service — create, manage, and generate code migrations."""

from __future__ import annotations

import difflib
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.migrations.ai_service import generate_correction, generate_migration
from app.models import Dependency, Migration, Project

settings = get_settings()


def _generate_diff(original: str, migrated: str, filename: str = "source.py") -> str:
    """Generate a unified diff between original and migrated code."""
    original_lines = original.splitlines(keepends=True)
    migrated_lines = migrated.splitlines(keepends=True)
    diff = difflib.unified_diff(
        original_lines,
        migrated_lines,
        fromfile=f"a/{filename}",
        tofile=f"b/{filename}",
        lineterm="",
    )
    return "".join(diff)


async def create_migration(
    db: AsyncSession,
    project_id: str,
    dependency_id: str,
) -> Migration:
    """Create a new migration record."""
    # Look up the dependency
    dep_result = await db.execute(
        select(Dependency).where(Dependency.id == dependency_id)
    )
    dep = dep_result.scalar_one_or_none()
    if not dep:
        raise ValueError("Dependency not found")

    # Look up the project
    proj_result = await db.execute(
        select(Project).where(Project.id == project_id)
    )
    project = proj_result.scalar_one_or_none()
    if not project:
        raise ValueError("Project not found")

    # Read all Python source files from the project (excluding tests)
    source_path = Path(project.source)
    source_files: dict[str, str] = {}
    for py_file in sorted(source_path.rglob("*.py")):
        parts = py_file.parts
        if any(p.startswith(".") or p == "__pycache__" or p == "venv" for p in parts):
            continue
        # Skip test files for migration (we want to migrate source code)
        rel = str(py_file.relative_to(source_path))
        if not rel.startswith("test"):
            try:
                source_files[rel] = py_file.read_text(encoding="utf-8")
            except (UnicodeDecodeError, PermissionError):
                continue

    # Combine all source files into a single block for migration context
    original_code = ""
    for fname, content in source_files.items():
        original_code += f"# === FILE: {fname} ===\n{content}\n\n"

    migration = Migration(
        project_id=project_id,
        dependency_id=dependency_id,
        from_version=dep.current_version,
        to_version=dep.latest_version,
        status="pending",
        original_code=original_code.strip(),
        ai_model=settings.OLLAMA_MODEL,
    )
    db.add(migration)
    await db.flush()
    await db.refresh(migration)
    return migration


async def get_migration_by_id(db: AsyncSession, migration_id: str) -> Migration | None:
    """Get a migration by ID."""
    result = await db.execute(select(Migration).where(Migration.id == migration_id))
    return result.scalar_one_or_none()


async def run_generation(db: AsyncSession, migration: Migration) -> Migration:
    """Run AI-powered code generation for a migration."""
    migration.status = "generating"
    migration.attempts += 1
    await db.flush()

    # Get dependency name
    dep_name = "pandas"
    if migration.dependency_id:
        dep_result = await db.execute(
            select(Dependency).where(Dependency.id == migration.dependency_id)
        )
        dep = dep_result.scalar_one_or_none()
        if dep:
            dep_name = dep.name

    # Parse original code back into individual files and migrate each
    files = _parse_combined_source(migration.original_code or "")

    migrated_parts: list[str] = []
    all_explanations: list[str] = []

    for filename, content in files.items():
        result = await generate_migration(
            original_code=content,
            filename=filename,
            from_version=migration.from_version or "1.x",
            to_version=migration.to_version or "2.x",
            dependency_name=dep_name,
        )
        migrated_parts.append(f"# === FILE: {filename} ===\n{result.migrated_code}")
        all_explanations.append(f"**{filename}**: {result.explanation}")
        migration.ai_model = result.model

    migration.migrated_code = "\n\n".join(migrated_parts)
    migration.explanation = "\n\n".join(all_explanations)
    migration.diff = _generate_diff(
        migration.original_code or "",
        migration.migrated_code,
    )
    migration.status = "generated"
    await db.flush()
    await db.refresh(migration)
    return migration


async def run_correction(
    db: AsyncSession,
    migration: Migration,
    test_output: str,
) -> Migration:
    """Run AI correction loop for a failed migration."""
    migration.attempts += 1
    migration.status = "generating"
    await db.flush()

    files = _parse_combined_source(migration.original_code or "")
    migrated_files = _parse_combined_source(migration.migrated_code or "")

    corrected_parts: list[str] = []
    all_explanations: list[str] = []

    for filename, original_content in files.items():
        migrated_content = migrated_files.get(filename, original_content)
        result = await generate_correction(
            original_code=original_content,
            migrated_code=migrated_content,
            test_output=test_output,
            attempt=migration.attempts,
        )
        corrected_parts.append(f"# === FILE: {filename} ===\n{result.migrated_code}")
        all_explanations.append(f"**{filename}** (attempt {migration.attempts}): {result.explanation}")

    migration.migrated_code = "\n\n".join(corrected_parts)
    migration.explanation = "\n\n".join(all_explanations)
    migration.diff = _generate_diff(
        migration.original_code or "",
        migration.migrated_code,
    )
    migration.status = "generated"
    await db.flush()
    await db.refresh(migration)
    return migration


def _parse_combined_source(combined: str) -> dict[str, str]:
    """Parse combined source (with # === FILE: xxx === markers) back into files."""
    files: dict[str, str] = {}
    current_file: str | None = None
    current_lines: list[str] = []

    for line in combined.split("\n"):
        if line.startswith("# === FILE: ") and line.endswith(" ==="):
            if current_file is not None:
                files[current_file] = "\n".join(current_lines).strip()
            current_file = line[len("# === FILE: "):-len(" ===")]
            current_lines = []
        else:
            current_lines.append(line)

    if current_file is not None:
        files[current_file] = "\n".join(current_lines).strip()

    # If no file markers found, treat entire content as a single file
    if not files and combined.strip():
        files["source.py"] = combined.strip()

    return files
