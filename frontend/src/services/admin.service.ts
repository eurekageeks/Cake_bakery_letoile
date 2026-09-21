import { apiClient } from './api';
import type { ApiResponse } from '../types/api';
import type { AdminAnalyticsData, CustomerSummary, Order } from '../types/order';
import type { Product } from '../types/product';

export const adminService = {
  getAnalytics: async (): Promise<AdminAnalyticsData> => {
    const response = await apiClient.get<ApiResponse<AdminAnalyticsData>>('/admin/analytics');
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Could not fetch analytics');
  },

  getOrders: async (): Promise<Order[]> => {
    const response = await apiClient.get<ApiResponse<Order[]>>('/admin/orders');
    return response.data.data || [];
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await apiClient.patch<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, { status });
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Could not update status');
  },

  createProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.post<ApiResponse<Product>>('/admin/products', productData);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Could not create product');
  },

  updateProduct: async (productId: string, productData: Partial<Product>): Promise<Product> => {
    const response = await apiClient.put<ApiResponse<Product>>(`/admin/products/${productId}`, productData);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Could not update product');
  },

  deleteProduct: async (productId: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/admin/products/${productId}`);
    return response.data.success;
  },

  getCustomers: async (): Promise<CustomerSummary[]> => {
    const response = await apiClient.get<ApiResponse<CustomerSummary[]>>('/admin/customers');
    return response.data.data || [];
  },

  getPendingCustomers: async (): Promise<CustomerSummary[]> => {
    const response = await apiClient.get<ApiResponse<CustomerSummary[]>>('/admin/pending-customers');
    return response.data.data || [];
  },

  approveCustomer: async (userId: string): Promise<boolean> => {
    const response = await apiClient.patch<ApiResponse<boolean>>(`/admin/customers/${userId}/approve`);
    return response.data.success;
  },

  rejectCustomer: async (userId: string): Promise<boolean> => {
    const response = await apiClient.patch<ApiResponse<boolean>>(`/admin/customers/${userId}/reject`);
    return response.data.success;
  },
};
