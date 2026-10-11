from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from app.core.config import settings

_is_postgres = settings.DB_ASYNC_URL.startswith("postgresql")

# Async engine for FastAPI endpoints
async_engine = create_async_engine(
    settings.DB_ASYNC_URL,
    echo=False,
    future=True,
    # Serverless instances sleep between requests; drop dead connections instead of failing.
    pool_pre_ping=_is_postgres,
    pool_recycle=300 if _is_postgres else -1,
    connect_args=(
        # statement_cache_size=0 keeps asyncpg compatible with Neon's pooled (PgBouncer) endpoint.
        {"ssl": settings.DB_SSL or None, "statement_cache_size": 0}
        if _is_postgres
        else {}
    ),
)

AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

# Sync engine for seed script and table creation
sync_engine = create_engine(
    settings.DB_SYNC_URL,
    echo=False,
    pool_pre_ping=_is_postgres,
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autoflush=False,
    autocommit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
