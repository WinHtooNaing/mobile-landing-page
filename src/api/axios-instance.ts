/**
 * Axios client with bearer token injection and silent refresh.
 *
 * Mirrors the web app's src/api/axiosInstance.ts, but reads tokens from
 * SecureStore instead of localStorage. On an unrecoverable 401 the session is
 * cleared and an optional `onAuthFailure` callback is invoked so the UI can
 * redirect to login.
 */

import axios, { type InternalAxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

import { API_URL } from '@/config';
import { tokenStorage } from '@/lib/token-storage';

const REFRESH_ENDPOINT = '/auth/refresh';

export type RefreshData = {
  data?: { accessToken?: string; refreshToken?: string };
};

declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
  headers: {
    // Android emulator requests are plain HTTP from the device's perspective.
    Accept: 'application/json',
  },
});

// Avoid axios trying to use the browser XHR adapter on native; not strictly
// required, but keeps behaviour consistent with React Native's networking.
if (Platform.OS !== 'web') {
  // no-op: axios auto-selects the http adapter in RN
}

let onAuthFailure: (() => void) | null = null;

export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailure = handler;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token is available');
  }

  const response = await axios.post<RefreshData>(
    `${API_URL}${REFRESH_ENDPOINT}`,
    { refreshToken },
    { timeout: 20000 }
  );

  const accessToken = response.data.data?.accessToken;
  if (!accessToken) {
    throw new Error('The refresh response did not include an access token');
  }

  await tokenStorage.setAccessToken(accessToken);
  const rotated = response.data.data?.refreshToken;
  if (rotated) {
    await tokenStorage.setRefreshToken(rotated);
  }

  return accessToken;
}

api.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const config = error.config as InternalAxiosRequestConfig | undefined;
    const url = config?.url ?? '';
    const isAuthRoute =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes(REFRESH_ENDPOINT);

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      isAuthRoute
    ) {
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= refreshAccessToken();
      const accessToken = await refreshPromise;
      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch (refreshError) {
      await tokenStorage.clear();
      onAuthFailure?.();
      return Promise.reject(refreshError);
    } finally {
      refreshPromise = null;
    }
  }
);

/**
 * Extracts a human readable error message from an axios error.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}