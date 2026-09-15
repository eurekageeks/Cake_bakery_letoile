from typing import Any, Dict, Optional
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppException(Exception):
    """Base application exception."""
    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_SERVER_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[Any] = None,
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundException(AppException):
    def __init__(self, message: str = "Resource not found", code: str = "NOT_FOUND", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_404_NOT_FOUND, details=details)


class BadRequestException(AppException):
    def __init__(self, message: str = "Bad request", code: str = "BAD_REQUEST", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_400_BAD_REQUEST, details=details)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required", code: str = "UNAUTHORIZED", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_401_UNAUTHORIZED, details=details)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Permission denied", code: str = "FORBIDDEN", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_403_FORBIDDEN, details=details)


class ConflictException(AppException):
    def __init__(self, message: str = "Resource conflict", code: str = "CONFLICT", details: Optional[Any] = None):
        super().__init__(message=message, code=code, status_code=status.HTTP_409_CONFLICT, details=details)


def register_exception_handlers(app: FastAPI) -> None:
    """Register custom exception handlers with FastAPI application."""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        content: Dict[str, Any] = {
            "success": False,
            "message": exc.message,
            "code": exc.code,
        }
        if exc.details is not None:
            content["details"] = exc.details
        return JSONResponse(status_code=exc.status_code, content=content)

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        errors = []
        for err in exc.errors():
            loc = " -> ".join([str(l) for l in err.get("loc", []) if l != "body"])
            msg = err.get("msg", "Validation error")
            errors.append({"field": loc, "message": msg})

        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "success": False,
                "message": "Validation failed on input data",
                "code": "VALIDATION_ERROR",
                "details": errors,
            },
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail if isinstance(exc.detail, str) else "HTTP error occurred",
                "code": f"HTTP_{exc.status_code}",
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "An unexpected error occurred. Please try again later.",
                "code": "INTERNAL_SERVER_ERROR",
            },
        )
