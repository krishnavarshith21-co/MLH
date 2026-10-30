"""VERYNTH Backend configuration using pydantic-settings."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Backend
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    DATABASE_URL: str = "sqlite+aiosqlite:///./verynth.db"

    # JWT
    JWT_SECRET_KEY: str = "verynth-hackathon-secret-key-2024"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440

    # Ollama / Qwen
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "qwen2.5-coder:7b-instruct"

    # Paths
    SAMPLE_PROJECT_PATH: str = "../sample-project"

    # Security
    MAX_UPLOAD_SIZE_MB: int = 50
    VERIFICATION_TIMEOUT_SECONDS: int = 60
    MAX_AI_CORRECTION_ATTEMPTS: int = 3

    # Demo Environment
    ENABLE_DEMO_MODE: bool = True
    DEMO_USER_EMAIL: str = "demo@verynth.local"
    DEMO_USER_NAME: str = "VERYNTH Demo"
    DEMO_USER_ROLE: str = "Demo User"
    DEMO_ACCOUNT_TYPE: str = "Hackathon Demonstration"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}

    @property
    def sample_project_abs_path(self) -> Path:
        """Resolve sample project path relative to backend directory."""
        p = Path(self.SAMPLE_PROJECT_PATH)
        if not p.is_absolute():
            p = Path(__file__).resolve().parent.parent / p
        return p.resolve()


@lru_cache
def get_settings() -> Settings:
    return Settings()
