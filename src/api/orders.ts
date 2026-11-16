import { api } from './axios-instance';
import type {
  CreateOrderPayload,
  ManualPaymentPayload,
  Order,
} from '@/types';

export type CreateOrderResponse = {
  success?: boolean;
  message?: string;
  orderId?: string;
  data?: {
    id?: string;
    orderId?: string;
  };
};

type ManualPaymentResponse = {
  success?: boolean;
  message?: string;
};

export type OrdersResponse = {
  data: {
    items: Order[];
  };
};

export const createOrder = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const response = await api.post<CreateOrderResponse>('/orders', payload);
  return response.data;
};

export const submitManualPayment = async (
  orderId: string,
  payload: ManualPaymentPayload
): Promise<ManualPaymentResponse> => {
  const formData = new FormData();
  formData.append('providerCode', payload.providerCode);
  formData.append('transactionReference', payload.transactionReference);
  // React Native FormData accepts the { uri, name, type } file descriptor.
  formData.append('image', payload.image as unknown as Blob);

  const response = await api.post<ManualPaymentResponse>(
    `/payments/orders/${orderId}/manual`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return response.data;
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<OrdersResponse>('/orders');
  return response.data.data.items;
};