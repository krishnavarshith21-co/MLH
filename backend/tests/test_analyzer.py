"""Tests for Python AST compatibility analyzer."""

import tempfile
from pathlib import Path

from app.analysis.analyzer import analyze_directory, analyze_file


def test_detect_dataframe_append():
    """Verify DataFrame.append() is correctly detected in source code."""
    code = """
import pandas as pd

def process():
    df = pd.DataFrame()
    row = pd.DataFrame([{"a": 1}])
    df = df.append(row, ignore_index=True)
    return df
"""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code)
        f.flush()
        issues = analyze_file(f.name)
        assert len(issues) == 1
        assert issues[0].line == 7
        assert "DataFrame.append()" in issues[0].pattern
        assert "pd.concat" in issues[0].suggestion


def test_ignore_list_append():
    """Verify standard list.append() is not falsely flagged."""
    code = """
def test():
    items = []
    items.append(1)
    return items
"""
    with tempfile.NamedTemporaryFile("w", suffix=".py", delete=False) as f:
        f.write(code)
        f.flush()
        issues = analyze_file(f.name)
        assert len(issues) == 0


def test_analyze_sample_directory():
    """Verify scanner finds all issues in the sample project."""
    sample_dir = Path(__file__).resolve().parent.parent.parent / "sample-project"
    issues = analyze_directory(sample_dir / "src")
    # There are 4 append calls in data_processor.py and 2 in analytics.py
    assert len(issues) == 6
