from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.database import Base, AsyncSessionLocal, engine
from app.core.exceptions import register_exception_handlers
from app.utils.seed_data import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan manager: Create tables and auto-seed initial bakery data."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        try:
            await seed_database(session)
        except Exception as e:
            print(f"Warning: Database seeding encountered: {e}")

    yield
    # Cleanup / shutdown tasks


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    description="""
# 🎂 L'Étoile Artisan Bakery & Cake E-Commerce API

Production-ready backend API providing full-featured bakery e-commerce operations:
- **Authentication**: JWT auth, registration, customer & staff accounts
- **Product Catalog & Customization**: Flavours, weights, eggless options, photo reference uploads
- **Dynamic Delivery Scheduler**: Slot checking, pin-code validation, preparation time rules
- **Cart & Wishlist Engine**: Real-time server-side price calculations, add-ons
- **Payment & Checkout**: Secure Razorpay integration, webhook processing
- **Bakery Order Pipeline**: Real-time state machine from preparation to dispatch
- **Admin Analytics & Management**: Inventory controls, orders, customer insights
    """,
)

# Configure CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Register standardized error handlers
register_exception_handlers(app)

# Include versioned API routers
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
async def root() -> JSONResponse:
    """Root entrypoint returning API metadata."""
    return JSONResponse(
        content={
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "docs": "/docs",
            "health": f"{settings.API_V1_STR}/health",
            "status": "online",
        }
    )
