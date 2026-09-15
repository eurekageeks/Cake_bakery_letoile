import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    name: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(220), unique=True, index=True, nullable=False)
    short_description: Mapped[str] = mapped_column(String(300), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    base_price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    category_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    category_name: Mapped[str] = mapped_column(String(100), default="Celebration Cakes", nullable=False)
    occasion: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    rating: Mapped[float] = mapped_column(Float, default=4.9, nullable=False)
    review_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    best_seller: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    customizable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    eggless_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sugar_free_available: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    preparation_time_hours: Mapped[int] = mapped_column(Integer, default=3, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    ingredients: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # Comma-separated or JSON
    allergens: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    storage_instructions: Mapped[Optional[str]] = mapped_column(String(300), default="Keep refrigerated between 2°C - 5°C. Best consumed within 48 hours.", nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="products")
    variants: Mapped[List["ProductVariant"]] = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")


class ProductVariant(Base):
    __tablename__ = "product_variants"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    flavour: Mapped[str] = mapped_column(String(100), nullable=False)
    weight: Mapped[str] = mapped_column(String(50), nullable=False)
    eggless: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    discount_price: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sku: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    stock: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    product: Mapped["Product"] = relationship("Product", back_populates="variants")


class ProductAddon(Base):
    __tablename__ = "product_addons"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    category: Mapped[str] = mapped_column(String(50), default="Candles", nullable=False)
    image_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
