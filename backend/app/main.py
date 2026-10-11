import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.core.database import async_engine, Base
from app.api.v1 import (
    auth, kyb, catalog, pricing, inventory, orders, payments,
    fulfillment, invoicing, cms, ai_helper, support
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all DB tables asynchronously (no-op when they already exist)
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AapnoKhet Pure Food Supply Chain B2B E-Commerce Platform API",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locally uploaded documents. Vercel's filesystem is read-only, so this is skipped there;
# move uploads to Vercel Blob before relying on them in production.
if settings.SERVE_LOCAL_UPLOADS:
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(kyb.router, prefix=settings.API_V1_STR)
app.include_router(catalog.router, prefix=settings.API_V1_STR)
app.include_router(pricing.router, prefix=settings.API_V1_STR)
app.include_router(inventory.router, prefix=settings.API_V1_STR)
app.include_router(orders.router, prefix=settings.API_V1_STR)
app.include_router(payments.router, prefix=settings.API_V1_STR)
app.include_router(fulfillment.router, prefix=settings.API_V1_STR)
app.include_router(invoicing.router, prefix=settings.API_V1_STR)
app.include_router(cms.router, prefix=settings.API_V1_STR)
app.include_router(ai_helper.router, prefix=settings.API_V1_STR)
app.include_router(support.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "compliance": "FSSAI + GSTIN Verified B2B Direct Food Supply"
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "AapnoKhet Backend API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
