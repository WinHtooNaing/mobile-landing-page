import { api } from './axios-instance';
import type { ApiResponse, Category } from '@/types';

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get<ApiResponse<Category[]>>('/categories');
  return response.data.data;
};