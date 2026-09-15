import uuid
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    order_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(150), nullable=False)
    customer_email: Mapped[str] = mapped_column(String(255), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(30), nullable=False)
    delivery_address: Mapped[str] = mapped_column(Text, nullable=False)
    delivery_city: Mapped[str] = mapped_column(String(100), default="Bengaluru", nullable=False)
    delivery_pincode: Mapped[str] = mapped_column(String(20), nullable=False)
    delivery_date: Mapped[str] = mapped_column(String(30), nullable=False)
    delivery_slot: Mapped[str] = mapped_column(String(50), nullable=False)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    subtotal: Mapped[float] = mapped_column(Float, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    delivery_fee: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    discount_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    
    status: Mapped[str] = mapped_column(String(30), default="CONFIRMED", nullable=False)  # PENDING, CONFIRMED, PREPARING, DECORATING, READY_FOR_DISPATCH, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    payment_status: Mapped[str] = mapped_column(String(30), default="SUCCESS", nullable=False)  # PENDING, SUCCESS, FAILED
    payment_method: Mapped[str] = mapped_column(String(50), default="RAZORPAY", nullable=False)
    payment_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False
    )

    user: Mapped[Optional["User"]] = relationship("User", back_populates="orders")
    items: Mapped[List["OrderItem"]] = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True
    )
    order_id: Mapped[str] = mapped_column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[str] = mapped_column(String(36), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    flavour: Mapped[str] = mapped_column(String(100), nullable=False)
    weight: Mapped[str] = mapped_column(String(50), nullable=False)
    is_eggless: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    custom_message: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    order: Mapped["Order"] = relationship("Order", back_populates="items")
