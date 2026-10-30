"""AST-based compatibility analyzer — finds deprecated API usage patterns in Python source."""

import ast
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class CompatIssue:
    """A single compatibility issue found in source code."""
    file: str
    line: int
    code: str         # the source line text
    function: str | None  # enclosing function name
    pattern: str      # e.g. "DataFrame.append()"
    suggestion: str   # recommended fix


# ── Deprecated patterns to detect ────────────────────────────────────────────

DEPRECATED_PATTERNS = {
    "append": {
        "pattern": "DataFrame.append()",
        "suggestion": "Replace df.append(other) with pd.concat([df, other], ignore_index=True). "
                      "DataFrame.append() was removed in pandas 2.0.",
    },
}


class _DeprecationVisitor(ast.NodeVisitor):
    """Walk AST looking for deprecated method calls."""

    def __init__(self, source_lines: list[str], filepath: str):
        self.source_lines = source_lines
        self.filepath = filepath
        self.issues: list[CompatIssue] = []
        self._current_function: str | None = None

    def visit_FunctionDef(self, node: ast.FunctionDef):
        old = self._current_function
        self._current_function = node.name
        self.generic_visit(node)
        self._current_function = old

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_Call(self, node: ast.Call):
        # Detect pattern: <expr>.append(...)
        if isinstance(node.func, ast.Attribute):
            method_name = node.func.attr
            if method_name in DEPRECATED_PATTERNS:
                info = DEPRECATED_PATTERNS[method_name]
                line_no = node.lineno
                code_line = (
                    self.source_lines[line_no - 1].rstrip()
                    if line_no <= len(self.source_lines)
                    else ""
                )

                # Heuristic: check if this looks like a DataFrame method call
                # by inspecting the source line for common DataFrame patterns
                if self._looks_like_dataframe_append(node, code_line):
                    self.issues.append(
                        CompatIssue(
                            file=self.filepath,
                            line=line_no,
                            code=code_line,
                            function=self._current_function,
                            pattern=info["pattern"],
                            suggestion=info["suggestion"],
                        )
                    )
        self.generic_visit(node)

    def _looks_like_dataframe_append(self, node: ast.Call, code_line: str) -> bool:
        """Heuristic to determine if .append() is called on a DataFrame-like variable."""
        # Check for common DataFrame variable name patterns or known indicators
        code_lower = code_line.lower()

        # Direct indicators: df.append, result.append, DataFrame patterns
        df_indicators = [
            "df", "dataframe", "result", "report", "combined",
            "current_inventory", "base_profile", "inventory",
            "profile", "frame", "data",
        ]
        # Check if the receiver looks like a DataFrame variable
        if isinstance(node.func, ast.Attribute) and isinstance(node.func.value, ast.Name):
            var_name = node.func.value.id.lower()
            for indicator in df_indicators:
                if indicator in var_name:
                    return True

        # Check for .append(... ignore_index=True) keyword — very strong signal
        for kw in node.keywords:
            if kw.arg == "ignore_index":
                return True

        # Check source line for DataFrame-related context
        for indicator in df_indicators:
            if indicator in code_lower:
                return True

        return False


def analyze_file(filepath: str | Path) -> list[CompatIssue]:
    """Analyze a single Python file for compatibility issues."""
    filepath = Path(filepath)
    if not filepath.exists() or not filepath.suffix == ".py":
        return []

    try:
        source = filepath.read_text(encoding="utf-8")
        source_lines = source.splitlines()
        tree = ast.parse(source, filename=str(filepath))
    except (SyntaxError, UnicodeDecodeError) as e:
        # Return a parse-error issue so the caller knows
        return [
            CompatIssue(
                file=str(filepath),
                line=0,
                code="",
                function=None,
                pattern="ParseError",
                suggestion=f"Could not parse file: {e}",
            )
        ]

    visitor = _DeprecationVisitor(source_lines, str(filepath))
    visitor.visit(tree)
    return visitor.issues


def analyze_directory(directory: str | Path) -> list[CompatIssue]:
    """Recursively analyze all Python files in a directory."""
    directory = Path(directory)
    all_issues: list[CompatIssue] = []
    for py_file in sorted(directory.rglob("*.py")):
        # Skip __pycache__, .venv, etc.
        parts = py_file.parts
        if any(p.startswith(".") or p == "__pycache__" or p == "venv" for p in parts):
            continue
        all_issues.extend(analyze_file(py_file))
    return all_issues
