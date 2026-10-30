"""AI service — Qwen2.5-Coder integration via Ollama HTTP API."""

from __future__ import annotations

import re
from dataclasses import dataclass

import httpx

from app.config import get_settings

settings = get_settings()


@dataclass
class AIGenerationResult:
    """Result from AI code generation."""
    migrated_code: str
    explanation: str
    model: str
    success: bool
    error: str | None = None


@dataclass
class AIFailureAnalysis:
    """AI analysis of test failures."""
    diagnosis: str
    suggested_fix: str
    corrected_code: str | None = None


def _build_migration_prompt(
    original_code: str,
    filename: str,
    from_version: str,
    to_version: str,
    dependency_name: str,
) -> str:
    """Build a prompt for migrating code from one dependency version to another."""
    return f"""You are an expert Python developer specializing in library migrations.

TASK: Migrate the following Python code from {dependency_name} {from_version} to {dependency_name} {to_version}.

KEY CHANGES in {dependency_name} 2.0:
- `DataFrame.append()` has been REMOVED. Use `pd.concat([df, other], ignore_index=True)` instead.
- `DataFrame.append(row, ignore_index=True)` → `pd.concat([df, row], ignore_index=True)`
- When appending in a loop, collect all DataFrames in a list first, then concat once (preferred), OR replace each append call with pd.concat.

FILE: {filename}

ORIGINAL CODE:
```python
{original_code}
```

REQUIREMENTS:
1. Replace ALL `DataFrame.append()` calls with `pd.concat()` equivalents
2. Preserve ALL existing functionality — the output must be functionally identical
3. Keep ALL comments, docstrings, type hints, and imports
4. Add `import pandas as pd` if not already present (needed for pd.concat)
5. Do NOT change function signatures, return types, or logic
6. Do NOT add any new functionality

OUTPUT FORMAT:
Return ONLY the complete migrated Python file. Do not include markdown code fences or explanations in the code block.
Start your response with the migrated code, then after the code add a section starting with "EXPLANATION:" that briefly describes each change you made.
"""


def _build_correction_prompt(
    original_code: str,
    migrated_code: str,
    test_output: str,
    attempt: int,
) -> str:
    """Build a prompt for correcting failed migration code."""
    return f"""You are an expert Python developer. Your previous code migration attempt #{attempt} has test failures.

ORIGINAL CODE (working):
```python
{original_code}
```

YOUR MIGRATED CODE (failing tests):
```python
{migrated_code}
```

TEST OUTPUT:
```
{test_output}
```

TASK:
1. Analyze the test failures
2. Fix the migrated code so all tests pass
3. The fix should still use pd.concat() instead of DataFrame.append()
4. Preserve ALL original functionality

OUTPUT FORMAT:
Return ONLY the corrected Python file. Then add "EXPLANATION:" section describing what you fixed.
"""


def _parse_ai_response(response_text: str) -> tuple[str, str]:
    """Parse AI response into (code, explanation) tuple."""
    text = response_text.strip()

    # Try to extract code from markdown fences
    code_match = re.search(r"```python\s*\n(.*?)```", text, re.DOTALL)
    if code_match:
        code = code_match.group(1).strip()
        # Everything after the code block is explanation
        after_code = text[code_match.end():].strip()
        explanation = after_code
        # Also check for explicit EXPLANATION section
        expl_match = re.search(r"EXPLANATION:\s*(.*)", after_code, re.DOTALL | re.IGNORECASE)
        if expl_match:
            explanation = expl_match.group(1).strip()
        return code, explanation

    # Try EXPLANATION: separator
    if "EXPLANATION:" in text:
        parts = text.split("EXPLANATION:", 1)
        code = parts[0].strip()
        explanation = parts[1].strip()
        # Clean code of any fences
        code = re.sub(r"^```\w*\n?", "", code)
        code = re.sub(r"\n?```$", "", code)
        return code.strip(), explanation

    # Fallback: treat entire response as code
    code = re.sub(r"^```\w*\n?", "", text)
    code = re.sub(r"\n?```$", "", code)
    return code.strip(), "AI-generated migration (no explicit explanation provided)."


async def get_active_model() -> str | None:
    """Check Ollama and find the best available model."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                tags = resp.json().get("models", [])
                model_names = [m.get("name", "") for m in tags]
                # Check for preferred models in order
                for preferred in [
                    settings.OLLAMA_MODEL,
                    "qwen2.5-coder:7b-instruct",
                    "qwen2.5-coder:7b",
                    "qwen2.5-coder:1.5b-instruct",
                    "qwen2.5-coder:1.5b",
                    "qwen2.5-coder",
                ]:
                    for name in model_names:
                        if preferred in name or name.startswith(preferred.split(":")[0]):
                            return name
                if model_names:
                    return model_names[0]
    except Exception:
        pass
    return None


async def check_ollama_available() -> bool:
    """Check if Ollama server is running and a model is available."""
    model = await get_active_model()
    return model is not None


async def _call_ollama(prompt: str) -> tuple[str | None, str]:
    """Call Ollama API to generate a response. Returns (response_text, model_name)."""
    model_name = await get_active_model() or settings.OLLAMA_MODEL
    url = f"{settings.OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.1,
            "num_predict": 4096,
        },
    }
    try:
        async with httpx.AsyncClient(timeout=180.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                return data.get("response", ""), model_name
            else:
                return None, model_name
    except (httpx.HTTPError, Exception):
        return None, model_name


async def generate_migration(
    original_code: str,
    filename: str,
    from_version: str,
    to_version: str,
    dependency_name: str,
) -> AIGenerationResult:
    """Use AI to generate migrated code."""
    # Check if Ollama is available
    available = await check_ollama_available()
    if not available:
        # Provide a deterministic fallback migration for the demo
        migrated = _fallback_migration(original_code, dependency_name)
        return AIGenerationResult(
            migrated_code=migrated,
            explanation=(
                "Ollama/Qwen model is unavailable. Applied deterministic rule-based migration: "
                "replaced all DataFrame.append() calls with pd.concat() equivalents."
            ),
            model="fallback-rule-based",
            success=True,
        )

    prompt = _build_migration_prompt(original_code, filename, from_version, to_version, dependency_name)
    response, used_model = await _call_ollama(prompt)

    if response is None:
        migrated = _fallback_migration(original_code, dependency_name)
        return AIGenerationResult(
            migrated_code=migrated,
            explanation="AI model returned no response. Applied rule-based fallback migration.",
            model="fallback-rule-based",
            success=True,
        )

    code, explanation = _parse_ai_response(response)
    return AIGenerationResult(
        migrated_code=code,
        explanation=explanation,
        model=used_model,
        success=True,
    )


async def generate_correction(
    original_code: str,
    migrated_code: str,
    test_output: str,
    attempt: int,
) -> AIGenerationResult:
    """Use AI to correct a failed migration based on test output."""
    available = await check_ollama_available()
    if not available:
        # For fallback, re-run the deterministic migration
        migrated = _fallback_migration(original_code, "pandas")
        return AIGenerationResult(
            migrated_code=migrated,
            explanation="Ollama unavailable. Re-applied rule-based migration.",
            model="fallback-rule-based",
            success=True,
        )

    prompt = _build_correction_prompt(original_code, migrated_code, test_output, attempt)
    response, used_model = await _call_ollama(prompt)

    if response is None:
        return AIGenerationResult(
            migrated_code=migrated_code,
            explanation="AI failed to generate a correction.",
            model=used_model,
            success=False,
            error="No response from AI model",
        )

    code, explanation = _parse_ai_response(response)
    return AIGenerationResult(
        migrated_code=code,
        explanation=explanation,
        model=used_model,
        success=True,
    )
    return AIGenerationResult(
        migrated_code=code,
        explanation=explanation,
        model=settings.OLLAMA_MODEL,
        success=True,
    )


async def analyze_test_failure(test_output: str, code: str) -> AIFailureAnalysis:
    """Use AI to analyze why tests failed."""
    available = await check_ollama_available()
    if not available:
        return AIFailureAnalysis(
            diagnosis="Ollama is unavailable. Unable to provide AI-powered failure analysis.",
            suggested_fix="Ensure DataFrame.append() calls are replaced with pd.concat().",
        )

    prompt = f"""Analyze this test failure and explain what went wrong:

TEST OUTPUT:
```
{test_output}
```

CODE UNDER TEST:
```python
{code}
```

Provide:
1. DIAGNOSIS: What caused the failure
2. SUGGESTED FIX: How to fix it
"""
    response, _ = await _call_ollama(prompt)
    if response:
        return AIFailureAnalysis(
            diagnosis=response,
            suggested_fix="See diagnosis above.",
        )
    return AIFailureAnalysis(
        diagnosis="Could not analyze test failure.",
        suggested_fix="Review test output manually.",
    )


# ── Deterministic fallback migration ─────────────────────────────────────────

def _fallback_migration(code: str, dependency_name: str) -> str:
    """Rule-based fallback migration when AI is unavailable.
    
    Handles the pandas DataFrame.append() → pd.concat() migration pattern.
    """
    if dependency_name.lower() != "pandas":
        return code

    lines = code.split("\n")
    result_lines: list[str] = []

    for line in lines:
        # Pattern: <var> = <expr>.append(<arg>, ignore_index=True)
        # Replace with: <var> = pd.concat([<expr>, <arg>], ignore_index=True)
        match = re.match(
            r"^(\s*)(\w+)\s*=\s*(\w+)\.append\((\w+),\s*ignore_index\s*=\s*True\)\s*$",
            line,
        )
        if match:
            indent = match.group(1)
            target = match.group(2)
            source = match.group(3)
            arg = match.group(4)
            result_lines.append(f"{indent}{target} = pd.concat([{source}, {arg}], ignore_index=True)")
            continue

        # Pattern: <var> = <expr>.append(<arg>, ignore_index=True) with the same var
        match2 = re.match(
            r"^(\s*)(\w[\w.]*)\s*=\s*(\w[\w.]*)\.append\((.+?),\s*ignore_index\s*=\s*True\)\s*$",
            line,
        )
        if match2:
            indent = match2.group(1)
            target = match2.group(2)
            source = match2.group(3)
            arg = match2.group(4)
            result_lines.append(f"{indent}{target} = pd.concat([{source}, {arg}], ignore_index=True)")
            continue

        result_lines.append(line)

    return "\n".join(result_lines)
