"""Dependency scanner — parse requirements.txt and query PyPI for latest versions."""

from __future__ import annotations

import re
from dataclasses import dataclass

import httpx


@dataclass
class ParsedDependency:
    name: str
    current_version: str | None
    constraint: str | None  # ==, >=, ~= etc.


# Known breaking-change major version bumps (for the demo)
KNOWN_BREAKING_CHANGES: dict[str, tuple[int, int]] = {
    "pandas": (1, 2),   # 1.x → 2.x has breaking changes
}


def parse_requirements(content: str) -> list[ParsedDependency]:
    """Parse a requirements.txt file into structured dependency list."""
    deps: list[ParsedDependency] = []
    for raw_line in content.splitlines():
        line = raw_line.strip()
        if not line or line.startswith(("#", "-")):
            continue

        # Match: package==1.2.3, package>=1.2.3, package~=1.2, package (no version)
        match = re.match(
            r"^([A-Za-z0-9_][A-Za-z0-9._-]*)\s*(==|>=|<=|~=|!=|>|<)?\s*([A-Za-z0-9.*_-]+)?",
            line,
        )
        if match:
            name = match.group(1).strip()
            constraint = match.group(2)
            version = match.group(3)
            deps.append(ParsedDependency(name=name, current_version=version, constraint=constraint))
    return deps


async def fetch_latest_version(package_name: str) -> str | None:
    """Query PyPI JSON API for the latest version of a package."""
    url = f"https://pypi.org/pypi/{package_name}/json"
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("info", {}).get("version")
    except (httpx.HTTPError, Exception):
        pass
    return None


def check_breaking_changes(name: str, current_version: str | None, latest_version: str | None) -> bool:
    """Check if upgrading would involve known breaking changes."""
    if not current_version or not latest_version:
        return False

    try:
        current_major = int(current_version.split(".")[0])
        latest_major = int(latest_version.split(".")[0])
    except (ValueError, IndexError):
        return False

    key = name.lower()
    if key in KNOWN_BREAKING_CHANGES:
        old, new = KNOWN_BREAKING_CHANGES[key]
        if current_major <= old and latest_major >= new:
            return True

    # Generic: any major version bump could be breaking
    return latest_major > current_major
