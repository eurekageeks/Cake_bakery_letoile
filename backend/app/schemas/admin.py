from typing import List, Optional
from pydantic import BaseModel


class KitchenQueueItem(BaseModel):
    id: str
    order_number: str
    customer_name: str
    items_summary: str
    delivery_date: str
    delivery_slot: str
    total_amount: float
    status: str
    is_urgent: bool = False


class AdminAnalyticsResponse(BaseModel):
    today_revenue: float
    today_revenue_formatted: str
    today_orders_count: int
    pending_delivery_count: int
    total_customers_count: int
    active_baking_count: int
    recent_orders: List[KitchenQueueItem] = []


class CustomerSummary(BaseModel):
    id: str
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str
    orders_count: int
    total_spent: float
    created_at: str
