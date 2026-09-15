from datetime import datetime, timezone
from typing import Generic, List, Optional, TypeVar
from pydantic import BaseModel, ConfigDict, Field

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    """Standard unified API response wrapper."""
    model_config = ConfigDict(arbitrary_types_allowed=True)

    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    code: Optional[str] = "SUCCESS"


class PaginationMeta(BaseModel):
    page: int = Field(1, ge=1, description="Current page number")
    limit: int = Field(20, ge=1, le=100, description="Items per page")
    total_items: int = Field(0, ge=0, description="Total number of items")
    total_pages: int = Field(0, ge=0, description="Total number of pages")
    has_next: bool = False
    has_prev: bool = False


class PaginatedResponse(BaseModel, Generic[T]):
    """Standard paginated API response."""
    success: bool = True
    message: str = "Data retrieved successfully"
    data: List[T] = []
    pagination: PaginationMeta


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    environment: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    database_connected: bool
    redis_connected: bool
