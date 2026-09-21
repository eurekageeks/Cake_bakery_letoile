from fastapi import APIRouter
from app.api.v1.endpoints import admin, auth, health, orders, products

api_v1_router = APIRouter()

# Register endpoint routers
api_v1_router.include_router(health.router, tags=["Health & System"])
api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_v1_router.include_router(products.router, prefix="/products", tags=["Product Catalog & Categories"])
api_v1_router.include_router(orders.router, prefix="/orders", tags=["Orders & Live Tracking"])
api_v1_router.include_router(admin.router, prefix="/admin", tags=["Admin Operations & Analytics"])
