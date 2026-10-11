import os
from typing import List
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Lets "vercel env pull backend/.env" work for local runs and seeding.
load_dotenv()

# Vercel sets VERCEL=1 in every build and function.
ON_VERCEL = bool(os.getenv("VERCEL"))

LOCAL_SQLITE_ASYNC = "sqlite+aiosqlite:///./aapnokhet.db"
LOCAL_SQLITE_SYNC = "sqlite:///./aapnokhet.db"


def _postgres_urls(raw: str) -> tuple[str, str, bool]:
    """
    Turn a Neon/Vercel Postgres URL (postgres://... ?sslmode=require) into
    SQLAlchemy URLs: asyncpg for the API, psycopg for the seed script.
    asyncpg does not accept libpq query options like sslmode, so they are
    stripped from the async URL and SSL is passed as a connect arg instead.
    """
    parts = urlsplit(raw)
    query = dict(parse_qsl(parts.query))
    needs_ssl = query.get("sslmode", "") not in ("", "disable")

    async_query = {k: v for k, v in query.items() if k not in ("sslmode", "channel_binding")}
    async_url = urlunsplit(("postgresql+asyncpg", parts.netloc, parts.path, urlencode(async_query), ""))
    sync_url = urlunsplit(("postgresql+psycopg", parts.netloc, parts.path, parts.query, ""))
    return async_url, sync_url, needs_ssl


def _database_urls() -> tuple[str, str, bool]:
    # The Neon integration on Vercel injects DATABASE_URL (and POSTGRES_URL as an alias).
    raw = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or ""
    if raw.startswith(("postgres://", "postgresql://")):
        return _postgres_urls(raw)
    if raw:
        return raw, os.getenv("SYNC_DATABASE_URL", LOCAL_SQLITE_SYNC), False
    return LOCAL_SQLITE_ASYNC, os.getenv("SYNC_DATABASE_URL", LOCAL_SQLITE_SYNC), False


_ASYNC_DB_URL, _SYNC_DB_URL, _DB_SSL = _database_urls()

_secret = os.getenv("SECRET_KEY", "")
if ON_VERCEL and not _secret:
    raise RuntimeError("SECRET_KEY must be set in the Vercel project's environment variables.")


class Settings(BaseSettings):
    PROJECT_NAME: str = "AapnoKhet B2B Food Supply"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = _secret or "local-dev-only-secret-change-me"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day for dev, 15 min for prod
    ALGORITHM: str = "HS256"

    # Database. Named so pydantic does not overwrite them with the raw DATABASE_URL env var.
    DB_ASYNC_URL: str = _ASYNC_DB_URL
    DB_SYNC_URL: str = _SYNC_DB_URL
    DB_SSL: bool = _DB_SSL

    # CORS: FRONTEND_ORIGIN can hold one URL or several separated by commas.
    BACKEND_CORS_ORIGINS: List[str] = [
        o.strip().rstrip("/")
        for o in os.getenv("FRONTEND_ORIGIN", "").split(",")
        if o.strip()
    ] + [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    # Storage & Uploads (the deployed filesystem is read-only, so uploads are local-only for now)
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    SERVE_LOCAL_UPLOADS: bool = not ON_VERCEL

    # AapnoKhet Seller Company Details (India Compliance)
    SELLER_NAME: str = "AapnoKhet Pure Food Supply Chain Pvt Ltd"
    SELLER_GSTIN: str = "08AAACA9876Q1Z2"
    SELLER_FSSAI: str = "12226999000845"
    SELLER_STATE: str = "Rajasthan"
    SELLER_STATE_CODE: str = "08"
    SELLER_ADDRESS: str = "Plot 42, Agro Food Park, RIICO Industrial Area, Jaipur, Rajasthan - 302013"
    SELLER_PHONE: str = "+91 98290 12345"
    SELLER_EMAIL: str = "orders@aapnokhet.com"

    # AI Helper config
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
