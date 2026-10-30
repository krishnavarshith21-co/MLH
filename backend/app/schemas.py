"""Pydantic schemas for request/response validation."""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


# ── Auth ──────────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class SigninRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user: "UserResponse"


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Projects ──────────────────────────────────────────────────────────────────

class ProjectImportRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    source: str = Field(..., min_length=1)  # filesystem path


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    name: str
    source: str
    language: str
    dep_file: str | None = None
    file_count: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Dependencies ──────────────────────────────────────────────────────────────

class DependencyResponse(BaseModel):
    id: str
    project_id: str
    name: str
    current_version: str | None = None
    latest_version: str | None = None
    is_outdated: bool
    has_breaking_changes: bool

    model_config = {"from_attributes": True}


class AnalysisIssue(BaseModel):
    file: str
    line: int
    code: str
    function: str | None = None
    pattern: str  # e.g. "DataFrame.append()"
    suggestion: str


class AnalysisResponse(BaseModel):
    project_id: str
    status: str
    dependencies: list[DependencyResponse]
    issues: list[AnalysisIssue]
    file_count: int
    total_issues: int


# ── Migrations ────────────────────────────────────────────────────────────────

class MigrationCreateRequest(BaseModel):
    project_id: str
    dependency_id: str


class MigrationResponse(BaseModel):
    id: str
    project_id: str
    dependency_id: str | None = None
    from_version: str | None = None
    to_version: str | None = None
    status: str
    original_code: str | None = None
    migrated_code: str | None = None
    diff: str | None = None
    explanation: str | None = None
    ai_model: str | None = None
    attempts: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class VerificationResponse(BaseModel):
    id: str
    migration_id: str
    status: str
    tests_passed: int
    tests_failed: int
    output: str | None = None
    error: str | None = None
    attempt_number: int
    created_at: datetime

    model_config = {"from_attributes": True}


class MigrationReportResponse(BaseModel):
    migration: MigrationResponse
    verifications: list[VerificationResponse]
    summary: dict


class HistoryItem(BaseModel):
    id: str
    project_name: str
    dependency_name: str
    from_version: str | None
    to_version: str | None
    status: str
    created_at: datetime


# ── Generic ───────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    message: str
    detail: str | None = None


class ErrorResponse(BaseModel):
    error: str
    detail: str | None = None
