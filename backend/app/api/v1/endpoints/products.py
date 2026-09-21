from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_db
from app.models.product import Category, Product
from app.schemas.common import ApiResponse, PaginatedResponse, PaginationMeta
from app.schemas.product import CategoryResponse, ProductResponse

router = APIRouter()


@router.get(
    "",
    response_model=PaginatedResponse[ProductResponse],
    summary="List active cake products with multi-facet filters & search",
)
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category name"),
    occasion: Optional[str] = Query(None, description="Filter by occasion"),
    eggless: Optional[bool] = Query(None, description="Filter eggless cakes only"),
    featured: Optional[bool] = Query(None, description="Filter featured products"),
    bestseller: Optional[bool] = Query(None, description="Filter best seller cakes"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    search: Optional[str] = Query(None, min_length=1, description="Search term in cake name or description"),
    sort_by: Optional[str] = Query("recommended", description="Sorting option: recommended, price_asc, price_desc, rating, newest"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
) -> PaginatedResponse[ProductResponse]:
    base_query = select(Product).where(Product.is_active == True)

    # Apply Filters
    if category and category.lower() != "all":
        base_query = base_query.where(func.lower(Product.category_name) == category.lower())

    if occasion and occasion.lower() != "all":
        base_query = base_query.where(func.lower(Product.occasion) == occasion.lower())

    if eggless is not None:
        base_query = base_query.where(Product.eggless_available == eggless)

    if featured is not None:
        base_query = base_query.where(Product.featured == featured)

    if bestseller is not None:
        base_query = base_query.where(Product.best_seller == bestseller)

    if min_price is not None:
        base_query = base_query.where(Product.base_price >= min_price)

    if max_price is not None:
        base_query = base_query.where(Product.base_price <= max_price)

    if search:
        search_pattern = f"%{search.lower()}%"
        base_query = base_query.where(
            or_(
                func.lower(Product.name).like(search_pattern),
                func.lower(Product.short_description).like(search_pattern),
                func.lower(Product.category_name).like(search_pattern),
            )
        )

    # Count total items
    count_query = select(func.count()).select_from(base_query.subquery())
    total_items = (await db.execute(count_query)).scalar_one()

    # Now apply options and sorting for the actual data fetching
    query = base_query.options(selectinload(Product.variants))
    
    # Apply Sorting
    if sort_by == "price_asc":
        query = query.order_by(Product.base_price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Product.base_price.desc())
    elif sort_by == "rating":
        query = query.order_by(Product.rating.desc())
    elif sort_by == "newest":
        query = query.order_by(Product.created_at.desc())
    else:
        # Recommended: best sellers first, then rating
        query = query.order_by(Product.best_seller.desc(), Product.rating.desc())

    # Pagination offset/limit
    offset = (page - 1) * limit
    paginated_query = query.offset(offset).limit(limit)
    result = await db.execute(paginated_query)
    products = result.scalars().all()

    total_pages = (total_items + limit - 1) // limit if total_items > 0 else 1

    return PaginatedResponse(
        success=True,
        message="Products fetched successfully",
        data=[ProductResponse.model_validate(p) for p in products],
        pagination=PaginationMeta(
            page=page,
            limit=limit,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        ),
    )


@router.get(
    "/categories",
    response_model=ApiResponse[List[CategoryResponse]],
    summary="List all active cake categories",
)
async def list_categories(
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[List[CategoryResponse]]:
    result = await db.execute(select(Category).where(Category.is_active == True))
    categories = result.scalars().all()
    return ApiResponse(
        success=True,
        message="Categories retrieved",
        data=[CategoryResponse.model_validate(c) for c in categories],
        code="CATEGORIES_OK",
    )


@router.get(
    "/{slug}",
    response_model=ApiResponse[ProductResponse],
    summary="Get single cake product details by slug",
)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> ApiResponse[ProductResponse]:
    result = await db.execute(
        select(Product).options(selectinload(Product.variants)).where(Product.slug == slug, Product.is_active == True)
    )
    product = result.scalars().first()

    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cake product '{slug}' was not found.",
        )

    return ApiResponse(
        success=True,
        message="Product details retrieved",
        data=ProductResponse.model_validate(product),
        code="PRODUCT_FOUND",
    )
