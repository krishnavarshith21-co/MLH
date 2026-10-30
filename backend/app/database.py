"""SQLAlchemy async database setup for SQLite."""

from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

db_url = settings.DATABASE_URL
if db_url.startswith("sqlite:///"):
    db_url = db_url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)

engine = create_async_engine(
    db_url,
    echo=False,
    connect_args={"check_same_thread": False},
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    """Dependency that yields an async database session."""
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db() -> None:
    """Create all tables and ensure schema is up to date."""
    from sqlalchemy import text
    async with engine.begin() as conn:
        from app.models import Dependency, Migration, Project, User, Verification  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)
        # Ensure new columns exist on SQLite without error
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(100) DEFAULT 'Developer'"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN account_type VARCHAR(100) DEFAULT 'Standard'"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE users ADD COLUMN is_demo BOOLEAN DEFAULT 0"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE projects ADD COLUMN is_demo BOOLEAN DEFAULT 0"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE projects ADD COLUMN description TEXT DEFAULT NULL"))
        except Exception:
            pass
