import { api } from './axios-instance';
import type { Cart, CartCreatePayload } from '@/types';

export const createAddToCart = async (
  payload: CartCreatePayload
): Promise<{ success: boolean }> => {
  const response = await api.post<{ success: boolean }>('/cart/items', payload);
  return response.data;
};

export const getAddToCartItems = async (): Promise<Cart> => {
  const response = await api.get<Cart>('/cart');
  return response.data;
};

export const deleteAddToCart = async (): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>('/cart');
  return response.data;
};

export const deleteAddToCartById = async (
  id: string
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/cart/items/${id}`);
  return response.data;
};

export const updateQuantity = async (
  payload: CartCreatePayload
): Promise<{ success: boolean }> => {
  const response = await api.patch<{ success: boolean }>(
    `/cart/items/${payload.productId}`,
    { quantity: payload.quantity }
  );
  return response.data;
};