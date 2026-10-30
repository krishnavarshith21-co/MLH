"""SQLAlchemy ORM models for VERYNTH."""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship

from app.database import Base


def _generate_uuid() -> str:
    return str(uuid.uuid4())


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=_generate_uuid)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=_utcnow)

    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=_generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    source = Column(String(500), nullable=False)  # filesystem path or URL
    language = Column(String(50), default="python")
    dep_file = Column(Text, nullable=True)  # contents of requirements.txt
    file_count = Column(Integer, default=0)
    status = Column(String(50), default="imported")  # imported, analyzing, analyzed, migrating, completed
    created_at = Column(DateTime, default=_utcnow)

    user = relationship("User", back_populates="projects")
    dependencies = relationship("Dependency", back_populates="project", cascade="all, delete-orphan")
    migrations = relationship("Migration", back_populates="project", cascade="all, delete-orphan")


class Dependency(Base):
    __tablename__ = "dependencies"

    id = Column(String, primary_key=True, default=_generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    current_version = Column(String(50), nullable=True)
    latest_version = Column(String(50), nullable=True)
    is_outdated = Column(Boolean, default=False)
    has_breaking_changes = Column(Boolean, default=False)

    project = relationship("Project", back_populates="dependencies")
    migrations = relationship("Migration", back_populates="dependency", cascade="all, delete-orphan")


class Migration(Base):
    __tablename__ = "migrations"

    id = Column(String, primary_key=True, default=_generate_uuid)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    dependency_id = Column(String, ForeignKey("dependencies.id"), nullable=True)
    from_version = Column(String(50), nullable=True)
    to_version = Column(String(50), nullable=True)
    status = Column(String(50), default="pending")  # pending, generating, generated, verifying, verified, failed, approved
    original_code = Column(Text, nullable=True)
    migrated_code = Column(Text, nullable=True)
    diff = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    ai_model = Column(String(100), nullable=True)
    attempts = Column(Integer, default=0)
    created_at = Column(DateTime, default=_utcnow)
    updated_at = Column(DateTime, default=_utcnow, onupdate=_utcnow)

    project = relationship("Project", back_populates="migrations")
    dependency = relationship("Dependency", back_populates="migrations")
    verifications = relationship("Verification", back_populates="migration", cascade="all, delete-orphan")


class Verification(Base):
    __tablename__ = "verifications"

    id = Column(String, primary_key=True, default=_generate_uuid)
    migration_id = Column(String, ForeignKey("migrations.id"), nullable=False)
    status = Column(String(50), default="pending")  # pending, running, passed, failed, error
    tests_passed = Column(Integer, default=0)
    tests_failed = Column(Integer, default=0)
    output = Column(Text, nullable=True)
    error = Column(Text, nullable=True)
    attempt_number = Column(Integer, default=1)
    created_at = Column(DateTime, default=_utcnow)

    migration = relationship("Migration", back_populates="verifications")
