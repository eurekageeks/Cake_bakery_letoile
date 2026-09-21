import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # API Metadata
    PROJECT_NAME: str = "L'Étoile Artisan Bakery API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Security & Auth
    SECRET_KEY: str = "change_me_super_secret_production_key_32_bytes_long_min"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database (PostgreSQL in Docker/Prod, SQLite in Local Dev fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:////tmp/bakery.db" if os.getenv("VERCEL") else "sqlite+aiosqlite:///./bakery.db")
    DATABASE_SYNC_URL: str = os.getenv("DATABASE_SYNC_URL", "sqlite:////tmp/bakery.db" if os.getenv("VERCEL") else "sqlite:///./bakery.db")

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Razorpay Payment Gateway
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder_key"
    RAZORPAY_KEY_SECRET: str = "rzp_test_placeholder_secret"
    RAZORPAY_WEBHOOK_SECRET: str = "rzp_webhook_secret_placeholder"

    # Cloudinary / Image Upload
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    # Bakery Operational Defaults
    DEFAULT_MIN_PREP_HOURS_STANDARD: int = 3
    DEFAULT_MIN_PREP_HOURS_CUSTOM: int = 24
    SAME_DAY_CUTOFF_HOUR: int = 18  # 6 PM
    DEFAULT_CURRENCY: str = "INR"
    DEFAULT_TAX_RATE_PERCENT: float = 5.0  # 5% GST for bakery/food items
    FREE_DELIVERY_THRESHOLD: float = 999.0
    STANDARD_DELIVERY_FEE: float = 99.0


settings = Settings()
