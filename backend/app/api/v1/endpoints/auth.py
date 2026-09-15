import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.user import User
from app.schemas.auth import TokenResponse, UserLogin, UserRegister, UserRegisterResponse, UserResponse
from app.schemas.common import ApiResponse

router = APIRouter()


@router.post(
    "/register",
    response_model=ApiResponse[UserRegisterResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Register a new customer account (submitted for admin approval)",
)
async def register(
    user_in: UserRegister,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[UserRegisterResponse]:
    # Check if email exists
    result = await db.execute(select(User).where(User.email == user_in.email.lower()))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists.",
        )

    # Create new customer with is_approved=False
    new_user = User(
        id=str(uuid.uuid4()),
        email=user_in.email.lower(),
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        phone=user_in.phone,
        role="CUSTOMER",
        is_active=True,
        is_verified=True,
        is_approved=False,  # Needs admin approval before logging in
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    reg_resp = UserRegisterResponse(
        is_approved=False,
        message="Your registration request has been submitted to the bakery administrator. Once approved, you will be able to sign in.",
        user=UserResponse.model_validate(new_user),
    )

    return ApiResponse(
        success=True,
        message="Registration request submitted! Please wait for bakery admin verification before signing in.",
        data=reg_resp,
        code="REGISTRATION_PENDING_APPROVAL",
    )


@router.post(
    "/login",
    response_model=ApiResponse[TokenResponse],
    summary="Authenticate user and issue JWT access token",
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[TokenResponse]:
    result = await db.execute(select(User).where(User.email == credentials.email.lower()))
    user = result.scalars().first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email address or password.",
        )

    if not user.is_approved:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account registration is pending admin approval. You will be able to sign in once the bakery staff verifies your account.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact bakery customer support.",
        )

    access_token = create_access_token(subject=user.id, role=user.role)
    token_resp = TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

    return ApiResponse(
        success=True,
        message="Login successful. Welcome back!",
        data=token_resp,
        code="LOGIN_SUCCESS",
    )


@router.get(
    "/me",
    response_model=ApiResponse[UserResponse],
    summary="Get profile of currently logged-in user",
)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> ApiResponse[UserResponse]:
    return ApiResponse(
        success=True,
        message="User profile retrieved",
        data=UserResponse.model_validate(current_user),
        code="PROFILE_OK",
    )
