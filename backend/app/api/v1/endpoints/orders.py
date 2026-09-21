import random
import uuid
from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db, security_bearer
from app.core.security import decode_token
from app.models.order import Order, OrderItem
from app.schemas.common import ApiResponse
from app.schemas.order import OrderCreate, OrderResponseSchema

router = APIRouter()


@router.post(
    "",
    response_model=ApiResponse[OrderResponseSchema],
    status_code=status.HTTP_201_CREATED,
    summary="Place a new cake celebration order",
)
async def create_order(
    order_in: OrderCreate,
    credentials=Depends(security_bearer),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[OrderResponseSchema]:
    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one cake item.",
        )

    user_id = None
    if credentials:
        try:
            payload = decode_token(credentials.credentials)
            user_id = payload.get("sub")
        except Exception:
            user_id = None

    # Calculate Subtotal, Tax, Delivery
    subtotal = sum(item.price * item.quantity for item in order_in.items)
    tax_amount = round(subtotal * 0.05, 2)
    delivery_fee = 0.0 if subtotal >= 999 else 99.0
    discount_amount = 0.0
    total_amount = round(subtotal + tax_amount + delivery_fee - discount_amount, 2)

    order_number = f"LET-{random.randint(10000, 99999)}"

    new_order = Order(
        id=str(uuid.uuid4()),
        order_number=order_number,
        user_id=user_id,
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email.lower(),
        customer_phone=order_in.customer_phone,
        delivery_address=order_in.delivery_address,
        delivery_city=order_in.delivery_city,
        delivery_pincode=order_in.delivery_pincode,
        delivery_date=order_in.delivery_date,
        delivery_slot=order_in.delivery_slot,
        instructions=order_in.instructions,
        subtotal=subtotal,
        tax_amount=tax_amount,
        delivery_fee=delivery_fee,
        discount_amount=discount_amount,
        total_amount=total_amount,
        status="CONFIRMED",
        payment_status="SUCCESS",
        payment_method=order_in.payment_method,
        payment_id=f"pay_rzp_{uuid.uuid4().hex[:12]}",
        created_at=datetime.now(timezone.utc),
    )
    db.add(new_order)
    await db.flush()

    for item in order_in.items:
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            order_id=new_order.id,
            product_id=item.product_id,
            product_name=item.product_name,
            image_url=item.image_url,
            price=item.price,
            quantity=item.quantity,
            flavour=item.flavour,
            weight=item.weight,
            is_eggless=item.is_eggless,
            custom_message=item.custom_message,
        )
        db.add(order_item)

    await db.commit()
    await db.refresh(new_order)

    res = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == new_order.id)
    )
    saved_order = res.scalars().first()

    return ApiResponse(
        success=True,
        message=f"Celebration order #{new_order.order_number} placed successfully!",
        data=OrderResponseSchema.model_validate(saved_order),
        code="ORDER_CREATED",
    )


@router.get(
    "/my-orders",
    response_model=ApiResponse[List[OrderResponseSchema]],
    summary="Get order history for customer",
)
async def get_my_orders(
    email: Optional[str] = Query(None),
    credentials=Depends(security_bearer),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[List[OrderResponseSchema]]:
    user_id = None
    if credentials:
        try:
            payload = decode_token(credentials.credentials)
            user_id = payload.get("sub")
        except Exception:
            user_id = None

    query = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())

    if user_id:
        query = query.where(Order.user_id == user_id)
    elif email:
        query = query.where(Order.customer_email == email.lower())
    else:
        query = query.limit(5)

    result = await db.execute(query)
    orders = result.scalars().all()

    return ApiResponse(
        success=True,
        message="Order history retrieved",
        data=[OrderResponseSchema.model_validate(o) for o in orders],
        code="ORDERS_OK",
    )
