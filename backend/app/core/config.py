import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AapnoKhet B2B Food Supply"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aapnokhet_super_secret_jwt_key_2026_pure_food_b2b_chain")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day for dev, 15 min for prod
    ALGORITHM: str = "HS256"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./aapnokhet.db")
    SYNC_DATABASE_URL: str = os.getenv("SYNC_DATABASE_URL", "sqlite:///./aapnokhet.db")
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:8000"
    ]
    
    # Storage & Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    
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
