"""SQLAlchemy async database setup for SQLite."""

from __future__ import annotations

from sqlalchemy import event
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.config import get_settings

settings = get_settings()

db_url = settings.resolved_database_url

engine = create_async_engine(
    db_url,
    echo=False,
    connect_args={"check_same_thread": False, "timeout": 30},
)


@event.listens_for(engine.sync_engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    """Enforce WAL mode, 30s busy timeout, and normal synchronous writes for high concurrency."""
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA journal_mode=WAL")
    cursor.execute("PRAGMA busy_timeout=30000")
    cursor.execute("PRAGMA synchronous=NORMAL")
    cursor.close()


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
        finally:
            await session.close()


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
