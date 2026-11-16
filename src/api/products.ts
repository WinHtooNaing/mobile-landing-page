import { api } from './axios-instance';
import type { Product, ProductList } from '@/types';

export const getNewCollection = async (): Promise<ProductList> => {
  const response = await api.get<ProductList>(
    '/products?page=1&limit=8&sortOrder=desc'
  );
  return response.data;
};

export const getProductDetail = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getAllProducts = async (
  page: number,
  limit: number,
  sortOrder: 'asc' | 'desc',
  categoryId?: string
): Promise<ProductList> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortOrder,
  });

  if (categoryId !== undefined) {
    params.set('categoryId', String(categoryId));
  }

  const response = await api.get<ProductList>(`/products?${params.toString()}`);
  return response.data;
};