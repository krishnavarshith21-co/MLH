"""Tests for requirements.txt parsing and version checks."""

from __future__ import annotations

from app.analysis.scanner import check_breaking_changes, parse_requirements


def test_parse_requirements():
    content = """
pandas==1.5.3
numpy>=1.24.0
pytest~=7.4.0
# Comment line
requests
"""
    deps = parse_requirements(content)
    names = {d.name for d in deps}
    assert "pandas" in names
    assert "numpy" in names
    assert "pytest" in names
    assert "requests" in names

    pandas_dep = next(d for d in deps if d.name == "pandas")
    assert pandas_dep.current_version == "1.5.3"


def test_breaking_changes_detection():
    # pandas 1.x to 2.x is breaking
    assert check_breaking_changes("pandas", "1.5.3", "2.0.0") is True
    # pandas 2.0 to 2.1 is minor
    assert check_breaking_changes("pandas", "2.0.0", "2.1.0") is False
    # other library minor update
    assert check_breaking_changes("numpy", "1.24.0", "1.24.1") is False
