"""Authentication service — password hashing and JWT token management."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

import bcrypt
import jwt
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models import User

settings = get_settings()


def hash_password(password: str) -> str:
    """Hash a password securely using bcrypt with 72-byte safe boundary."""
    pw_bytes = password.encode("utf-8")[:72]
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(pw_bytes, salt).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its bcrypt hash safely."""
    try:
        pw_bytes = password.encode("utf-8")[:72]
        hash_bytes = password_hash.encode("utf-8")
        return bcrypt.checkpw(pw_bytes, hash_bytes)
    except Exception:
        return False


def create_access_token(user_id: str) -> str:
    """Create a JWT access token."""
    payload = {
        "sub": user_id,
        "exp": datetime.now(UTC) + timedelta(minutes=settings.JWT_EXPIRATION_MINUTES),
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    """Decode and validate a JWT access token. Returns payload or None."""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Look up a user by email address (case-insensitive and trimmed)."""
    if not email:
        return None
    norm_email = email.strip().lower()
    result = await db.execute(
        select(User).where(func.lower(User.email) == norm_email)
    )
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    """Look up a user by ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    name: str,
    email: str,
    password: str,
    role: str = "Developer",
    account_type: str = "Standard",
    is_demo: bool = False,
) -> User:
    """Create and persist a new user with hashed password and normalized email."""
    norm_email = email.strip().lower()
    norm_name = name.strip()
    user = User(
        name=norm_name,
        email=norm_email,
        password_hash=hash_password(password),
        role=role,
        account_type=account_type,
        is_demo=is_demo,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
