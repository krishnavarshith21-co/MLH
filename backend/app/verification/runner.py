"""Sandboxed verification runner — executes pytest in a subprocess."""

import asyncio
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.migrations.service import _parse_combined_source
from app.models import Migration, Project, Verification

settings = get_settings()


def _parse_pytest_output(output: str) -> tuple[int, int]:
    """Parse pytest output to extract pass/fail counts."""
    # Match patterns like: "5 passed", "2 failed", "5 passed, 2 failed"
    passed = 0
    failed = 0

    # Standard pytest summary line
    match = re.search(r"(\d+)\s+passed", output)
    if match:
        passed = int(match.group(1))

    match = re.search(r"(\d+)\s+failed", output)
    if match:
        failed = int(match.group(1))

    match = re.search(r"(\d+)\s+error", output)
    if match:
        failed += int(match.group(1))

    return passed, failed


async def run_verification(
    db: AsyncSession,
    migration: Migration,
    project: Project,
) -> Verification:
    """Run pytest verification of migrated code in a temporary directory."""
    # Count existing verifications to determine attempt number
    from sqlalchemy import select, func
    count_result = await db.execute(
        select(func.count()).where(Verification.migration_id == migration.id)
    )
    attempt_number = (count_result.scalar() or 0) + 1

    verification = Verification(
        migration_id=migration.id,
        status="running",
        attempt_number=attempt_number,
    )
    db.add(verification)
    await db.flush()

    migration.status = "verifying"
    await db.flush()

    # Create temporary directory with project structure
    tmp_dir = tempfile.mkdtemp(prefix="verynth_verify_")

    try:
        source_path = Path(project.source)

        # Copy the entire project to temp dir
        project_tmp = Path(tmp_dir) / "project"
        shutil.copytree(source_path, project_tmp)

        # Overwrite source files with migrated code
        if migration.migrated_code:
            migrated_files = _parse_combined_source(migration.migrated_code)
            for filename, content in migrated_files.items():
                target = project_tmp / filename
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(content, encoding="utf-8")

        # Create a minimal conftest or ensure src is importable
        init_file = project_tmp / "src" / "__init__.py"
        if not init_file.exists():
            init_file.parent.mkdir(parents=True, exist_ok=True)
            init_file.write_text("", encoding="utf-8")

        # Run pytest
        env = os.environ.copy()
        env["PYTHONPATH"] = str(project_tmp)
        # Remove potentially harmful env vars
        env.pop("PYTHONSTARTUP", None)

        process = await asyncio.create_subprocess_exec(
            sys.executable, "-m", "pytest",
            str(project_tmp / "tests"),
            "-v",
            "--tb=short",
            "--no-header",
            "-q",
            cwd=str(project_tmp),
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=env,
        )

        try:
            stdout, stderr = await asyncio.wait_for(
                process.communicate(),
                timeout=settings.VERIFICATION_TIMEOUT_SECONDS,
            )
        except asyncio.TimeoutError:
            process.kill()
            await process.wait()
            verification.status = "error"
            verification.error = "Test execution timed out"
            verification.output = "TIMEOUT: pytest did not complete within the allowed time."
            migration.status = "failed"
            await db.flush()
            await db.refresh(verification)
            return verification

        stdout_text = stdout.decode("utf-8", errors="replace")
        stderr_text = stderr.decode("utf-8", errors="replace")
        full_output = stdout_text + "\n" + stderr_text

        passed, failed = _parse_pytest_output(full_output)
        verification.output = full_output.strip()
        verification.tests_passed = passed
        verification.tests_failed = failed

        if process.returncode == 0:
            verification.status = "passed"
            migration.status = "verified"
        else:
            verification.status = "failed"
            verification.error = f"pytest exited with code {process.returncode}"
            migration.status = "failed"

    except Exception as e:
        verification.status = "error"
        verification.error = str(e)
        migration.status = "failed"

    finally:
        # Clean up temp directory
        try:
            shutil.rmtree(tmp_dir, ignore_errors=True)
        except Exception:
            pass

    await db.flush()
    await db.refresh(verification)
    return verification
