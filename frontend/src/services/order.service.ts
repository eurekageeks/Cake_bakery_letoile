import { apiClient } from './api';
import type { ApiResponse } from '../types/api';
import type { Order } from '../types/order';

export interface OrderItemCreatePayload {
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

export interface OrderCreatePayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  delivery_date: string;
  delivery_slot: string;
  instructions?: string;
  payment_method?: string;
  items: OrderItemCreatePayload[];
}

export const orderService = {
  createOrder: async (payload: OrderCreatePayload): Promise<Order> => {
    const response = await apiClient.post<ApiResponse<Order>>('/orders', payload);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Order creation failed');
  },

  getMyOrders: async (email?: string): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/orders/my-orders', {
      params: email ? { email } : undefined,
    });
    return response.data.data || [];
  },
};
