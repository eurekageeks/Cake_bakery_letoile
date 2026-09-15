import { apiClient } from './api';
import type { ApiResponse, PaginatedResponse } from '../types/api';
import type { Product } from '../types/product';

export interface ProductFilterParams {
  category?: string;
  occasion?: string;
  eggless?: boolean;
  featured?: boolean;
  bestseller?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  page?: number;
  limit?: number;
}

export const productService = {
  getProducts: async (params?: ProductFilterParams): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(`/products/${slug}`);
    if (response.data.data) {
      return response.data.data;
    }
    throw new Error('Product not found');
  },

  getCategories: async (): Promise<{ id: string; name: string; slug: string }[]> => {
    const response = await apiClient.get<ApiResponse<{ id: string; name: string; slug: string }[]>>('/products/categories');
    return response.data.data || [];
  },
};
