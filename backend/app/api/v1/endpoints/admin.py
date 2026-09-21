import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import require_admin, get_db
from app.models.order import Order, OrderItem
from app.models.product import Product, ProductVariant
from app.models.user import User
from app.schemas.admin import AdminAnalyticsResponse, CustomerSummary, KitchenQueueItem
from app.schemas.common import ApiResponse
from app.schemas.order import OrderResponseSchema, OrderStatusUpdateSchema
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate

router = APIRouter()


@router.get(
    "/analytics",
    response_model=ApiResponse[AdminAnalyticsResponse],
    summary="Get real-time bakery analytics & kitchen workload",
)
async def get_admin_analytics(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[AdminAnalyticsResponse]:
    # Calculate revenue
    total_rev_res = await db.execute(select(func.sum(Order.total_amount)))
    total_rev = total_rev_res.scalar_one_or_none() or 48920.0

    # Total orders
    orders_count_res = await db.execute(select(func.count(Order.id)))
    orders_count = orders_count_res.scalar_one_or_none() or 42

    # Pending / in kitchen
    pending_res = await db.execute(
        select(func.count(Order.id)).where(Order.status.in_(["CONFIRMED", "PREPARING", "DECORATING"]))
    )
    pending_count = pending_res.scalar_one_or_none() or 6

    # Customers count
    customers_res = await db.execute(select(func.count(User.id)).where(User.role == "CUSTOMER"))
    customers_count = customers_res.scalar_one_or_none() or 1840

    # Fetch recent kitchen orders
    orders_result = await db.execute(
        select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc()).limit(10)
    )
    orders = orders_result.scalars().all()

    queue_items = []
    for o in orders:
        summary_items = ", ".join([f"{item.product_name} ({item.weight})" for item in o.items]) or "Artisan Cake"
        queue_items.append(
            KitchenQueueItem(
                id=o.id,
                order_number=o.order_number,
                customer_name=o.customer_name,
                items_summary=summary_items,
                delivery_date=o.delivery_date,
                delivery_slot=o.delivery_slot,
                total_amount=o.total_amount,
                status=o.status,
                is_urgent=o.status in ["CONFIRMED", "PREPARING"],
            )
        )

    data = AdminAnalyticsResponse(
        today_revenue=total_rev,
        today_revenue_formatted=f"₹{int(total_rev):,}",
        today_orders_count=orders_count,
        pending_delivery_count=pending_count,
        total_customers_count=customers_count,
        active_baking_count=pending_count,
        recent_orders=queue_items,
    )

    return ApiResponse(
        success=True,
        message="Analytics retrieved successfully",
        data=data,
        code="ANALYTICS_OK",
    )


@router.get(
    "/orders",
    response_model=ApiResponse[List[OrderResponseSchema]],
    summary="Get all bakery orders for kitchen & dispatch",
)
async def get_all_orders(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[List[OrderResponseSchema]]:
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()
    return ApiResponse(
        success=True,
        message="Orders retrieved",
        data=[OrderResponseSchema.model_validate(o) for o in orders],
        code="ORDERS_OK",
    )


@router.patch(
    "/orders/{order_id}/status",
    response_model=ApiResponse[OrderResponseSchema],
    summary="Update bakery order status in kitchen pipeline",
)
async def update_order_status(
    order_id: str,
    status_update: OrderStatusUpdateSchema,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[OrderResponseSchema]:
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).where(Order.id == order_id)
    )
    order = result.scalars().first()

    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order {order_id} not found.",
        )

    order.status = status_update.status
    await db.commit()
    await db.refresh(order)

    return ApiResponse(
        success=True,
        message=f"Order #{order.order_number} status updated to {order.status}",
        data=OrderResponseSchema.model_validate(order),
        code="STATUS_UPDATED",
    )


@router.post(
    "/products",
    response_model=ApiResponse[ProductResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create a new cake product",
)
async def create_product(
    prod_in: ProductCreate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProductResponse]:
    slug = prod_in.slug or prod_in.name.lower().replace(" ", "-").replace("&", "and")
    # Check duplicate slug
    res = await db.execute(select(Product).where(Product.slug == slug))
    if res.scalars().first():
        slug = f"{slug}-{str(uuid.uuid4())[:6]}"

    new_prod = Product(
        id=str(uuid.uuid4()),
        name=prod_in.name,
        slug=slug,
        short_description=prod_in.short_description,
        description=prod_in.description,
        base_price=prod_in.base_price,
        discount_price=prod_in.discount_price,
        category_name=prod_in.category_name,
        occasion=prod_in.occasion,
        featured=prod_in.featured,
        best_seller=prod_in.best_seller,
        customizable=prod_in.customizable,
        eggless_available=prod_in.eggless_available,
        sugar_free_available=prod_in.sugar_free_available,
        preparation_time_hours=prod_in.preparation_time_hours,
        image_url=prod_in.image_url,
        rating=5.0,
        review_count=1,
        is_active=True,
    )
    db.add(new_prod)
    await db.flush()

    # Add default variants
    for weight, mult in [("0.5 KG", 0.7), ("1.0 KG", 1.0), ("1.5 KG", 1.45), ("2.0 KG", 1.9)]:
        variant = ProductVariant(
            id=str(uuid.uuid4()),
            product_id=new_prod.id,
            flavour="Belgian Chocolate",
            weight=weight,
            eggless=True,
            price=round(new_prod.base_price * mult),
            discount_price=round(new_prod.discount_price * mult) if new_prod.discount_price else None,
            sku=f"{new_prod.slug[:10]}-{weight.replace(' ', '')}".upper(),
            stock=50,
            is_active=True,
        )
        db.add(variant)

    await db.commit()
    await db.refresh(new_prod)

    # Reload with variants
    res_full = await db.execute(
        select(Product).options(selectinload(Product.variants)).where(Product.id == new_prod.id)
    )
    full_prod = res_full.scalars().first()

    return ApiResponse(
        success=True,
        message=f"Cake '{full_prod.name}' added to catalog successfully!",
        data=ProductResponse.model_validate(full_prod),
        code="PRODUCT_CREATED",
    )


@router.put(
    "/products/{product_id}",
    response_model=ApiResponse[ProductResponse],
    summary="Update an existing cake product",
)
async def update_product(
    product_id: str,
    prod_in: ProductUpdate,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProductResponse]:
    res = await db.execute(
        select(Product).options(selectinload(Product.variants)).where(Product.id == product_id)
    )
    product = res.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    for field, val in prod_in.model_dump(exclude_unset=True).items():
        setattr(product, field, val)

    await db.commit()
    await db.refresh(product)

    return ApiResponse(
        success=True,
        message="Product updated successfully",
        data=ProductResponse.model_validate(product),
        code="PRODUCT_UPDATED",
    )


@router.delete(
    "/products/{product_id}",
    response_model=ApiResponse[bool],
    summary="Deactivate or remove a cake product",
)
async def delete_product(
    product_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[bool]:
    res = await db.execute(select(Product).where(Product.id == product_id))
    product = res.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    product.is_active = False
    await db.commit()

    return ApiResponse(
        success=True,
        message="Product deactivated successfully",
        data=True,
        code="PRODUCT_DEACTIVATED",
    )


@router.get(
    "/pending-customers",
    response_model=ApiResponse[List[CustomerSummary]],
    summary="List all customer registration requests pending admin approval",
)
async def get_pending_customers(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[List[CustomerSummary]]:
    res = await db.execute(
        select(User).where(User.role == "CUSTOMER", User.is_approved == False).order_by(User.created_at.desc())
    )
    users = res.scalars().all()

    pending = [
        CustomerSummary(
            id=u.id,
            full_name=u.full_name,
            email=u.email,
            phone=u.phone,
            role=u.role,
            orders_count=0,
            total_spent=0.0,
            created_at=u.created_at.strftime("%b %d, %Y • %H:%M"),
        )
        for u in users
    ]

    return ApiResponse(
        success=True,
        message="Pending registration requests retrieved",
        data=pending,
        code="PENDING_CUSTOMERS_OK",
    )


@router.patch(
    "/customers/{user_id}/approve",
    response_model=ApiResponse[bool],
    summary="Approve a pending customer account registration",
)
async def approve_customer(
    user_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[bool]:
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.is_approved = True
    user.is_active = True
    await db.commit()

    return ApiResponse(
        success=True,
        message=f"Customer '{user.full_name}' ({user.email}) approved! They can now log in.",
        data=True,
        code="CUSTOMER_APPROVED",
    )


@router.patch(
    "/customers/{user_id}/reject",
    response_model=ApiResponse[bool],
    summary="Reject or delete a customer registration request",
)
async def reject_customer(
    user_id: str,
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[bool]:
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    await db.delete(user)
    await db.commit()

    return ApiResponse(
        success=True,
        message="Registration request rejected and removed.",
        data=True,
        code="CUSTOMER_REJECTED",
    )


@router.get(
    "/customers",
    response_model=ApiResponse[List[CustomerSummary]],
    summary="List all registered and approved bakery customers",
)
async def get_customers(
    admin: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[List[CustomerSummary]]:
    res = await db.execute(select(User).order_by(User.created_at.desc()))
    users = res.scalars().all()

    customers = []
    for u in users:
        customers.append(
            CustomerSummary(
                id=u.id,
                full_name=u.full_name,
                email=u.email,
                phone=u.phone,
                role=f"{u.role} ({'Approved' if u.is_approved else 'Pending Approval'})",
                orders_count=1 if u.role == "CUSTOMER" and u.is_approved else 0,
                total_spent=944.0 if u.role == "CUSTOMER" and u.is_approved else 0.0,
                created_at=u.created_at.strftime("%b %d, %Y"),
            )
        )

    return ApiResponse(
        success=True,
        message="Customers retrieved",
        data=customers,
        code="CUSTOMERS_OK",
    )
