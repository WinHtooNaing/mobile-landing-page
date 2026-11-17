import type { ApiResponse, Cart, CartCreatePayload } from "@/types";
import { api } from "./axios-instance";

export const CART_QUERY_KEY = ["cart"] as const;

export const createAddToCart = async (
  payload: CartCreatePayload,
): Promise<ApiResponse<Cart>> => {
  const response = await api.post<ApiResponse<Cart>>("/cart/items", payload);
  return response.data;
};

export const getAddToCartItems = async (): Promise<Cart> => {
  const response = await api.get<ApiResponse<Cart>>("/cart");

  return response.data.data;
};

export const deleteAddToCart = async (): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>("/cart");
  return response.data;
};

export const deleteAddToCartById = async (
  id: string,
): Promise<{ success: boolean }> => {
  const response = await api.delete<{ success: boolean }>(`/cart/items/${id}`);
  return response.data;
};

export const updateQuantity = async (
  payload: CartCreatePayload,
): Promise<{ success: boolean }> => {
  const response = await api.patch<{ success: boolean }>(
    `/cart/items/${payload.productId}`,
    { quantity: payload.quantity },
  );
  return response.data;
};
