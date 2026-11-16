import { api } from './axios-instance';
import type { AuthResponse, User } from '@/types';

export type RegisterProps = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export type LoginProps = {
  email: string;
  password: string;
};

export const register = async (payload: RegisterProps): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', payload, {
    validateStatus: () => true,
  });
  return response.data;
};

export const login = async (payload: LoginProps): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', payload, {
    validateStatus: () => true,
  });
  return response.data;
};

export type MeResponse = {
  success: boolean;
  data: User;
};

export const checkCurrentUser = async (): Promise<MeResponse> => {
  const response = await api.get<MeResponse>('/auth/me');
  return response.data;
};