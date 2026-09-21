from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.core.config import settings
from app.schemas.common import ApiResponse, HealthResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=ApiResponse[HealthResponse],
    summary="Health check and service status",
    description="Returns service uptime, operational status, version, and database connectivity.",
)
async def health_check(db: AsyncSession = Depends(get_db)) -> ApiResponse[HealthResponse]:
    db_connected = False
    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            db_connected = True
    except Exception:
        db_connected = False

    health_data = HealthResponse(
        status="healthy" if db_connected else "degraded",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        database_connected=db_connected,
        redis_connected=False,  # Checked when Redis cache is enabled
    )

    return ApiResponse(
        success=True,
        message="Service is active and responsive",
        data=health_data,
        code="HEALTH_OK",
    )
