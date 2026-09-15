from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class OrderItemCreate(BaseModel):
    product_id: str
    product_name: str
    image_url: str
    price: float
    quantity: int = 1
    flavour: str = "Belgian Chocolate"
    weight: str = "1.0 KG"
    is_eggless: bool = True
    custom_message: Optional[str] = None


class OrderCreate(BaseModel):
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    delivery_city: str = "Bengaluru"
    delivery_pincode: str
    delivery_date: str
    delivery_slot: str
    instructions: Optional[str] = None
    items: List[OrderItemCreate]
    payment_method: str = "RAZORPAY"


class OrderItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: Optional[str] = None
    product_id: str
    product_name: str
    image_url: str
    price: float
    quantity: int
    flavour: str
    weight: str
    is_eggless: bool
    custom_message: Optional[str] = None


class OrderResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    order_number: str
    customer_name: str
    customer_email: str
    customer_phone: str
    delivery_address: str
    delivery_city: str
    delivery_pincode: str
    delivery_date: str
    delivery_slot: str
    instructions: Optional[str] = None
    subtotal: float
    tax_amount: float
    delivery_fee: float
    discount_amount: float
    total_amount: float
    status: str
    payment_status: str
    payment_method: str
    created_at: datetime
    items: List[OrderItemSchema] = []


class OrderStatusUpdateSchema(BaseModel):
    status: str
