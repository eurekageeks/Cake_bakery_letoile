export interface OrderItem {
  id?: string;
  product_id: string;
  product_name: string;
  image_url: string;
  price: number;
  quantity: number;
  flavour: string;
  weight: string;
  is_eggless: boolean;
  custom_message?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  delivery_date: string;
  delivery_slot: string;
  instructions?: string;
  subtotal: number;
  tax_amount: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'DECORATING' | 'READY_FOR_DISPATCH' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  payment_status: 'PENDING' | 'SUCCESS' | 'FAILED';
  payment_method: string;
  created_at: string;
  items: OrderItem[];
}

export interface KitchenQueueItem {
  id: string;
  order_number: string;
  customer_name: string;
  items_summary: string;
  delivery_date: string;
  delivery_slot: string;
  total_amount: number;
  status: string;
  is_urgent: boolean;
}

export interface AdminAnalyticsData {
  today_revenue: number;
  today_revenue_formatted: string;
  today_orders_count: number;
  pending_delivery_count: number;
  total_customers_count: number;
  active_baking_count: number;
  recent_orders: KitchenQueueItem[];
}

export interface CustomerSummary {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  orders_count: number;
  total_spent: number;
  created_at: string;
}
