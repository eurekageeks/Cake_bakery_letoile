from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class CategoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class ProductVariantSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[str] = None
    flavour: str
    weight: str
    eggless: bool = True
    price: float
    discount_price: Optional[float] = None
    stock: int = 50
    sku: Optional[str] = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    slug: str
    short_description: str
    description: str
    base_price: float
    discount_price: Optional[float] = None
    category_id: Optional[str] = None
    category_name: str
    occasion: Optional[str] = None
    rating: float
    review_count: int
    featured: bool
    best_seller: bool
    customizable: bool
    eggless_available: bool
    sugar_free_available: bool
    preparation_time_hours: int
    image_url: str
    storage_instructions: Optional[str] = None
    is_active: bool
    created_at: datetime
    variants: List[ProductVariantSchema] = []


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2)
    slug: Optional[str] = None
    short_description: str
    description: str
    base_price: float
    discount_price: Optional[float] = None
    category_name: str = "Chocolate Cakes"
    occasion: Optional[str] = "Birthday"
    featured: bool = False
    best_seller: bool = False
    customizable: bool = True
    eggless_available: bool = True
    sugar_free_available: bool = False
    preparation_time_hours: int = 3
    image_url: str


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    short_description: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    discount_price: Optional[float] = None
    category_name: Optional[str] = None
    occasion: Optional[str] = None
    featured: Optional[bool] = None
    best_seller: Optional[bool] = None
    customizable: Optional[bool] = None
    eggless_available: Optional[bool] = None
    sugar_free_available: Optional[bool] = None
    preparation_time_hours: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
