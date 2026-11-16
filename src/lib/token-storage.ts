/**
 * Secure token storage backed by expo-secure-store.
 * Falls back to an in-memory store on environments where SecureStore is
 * unavailable (e.g. web) so the app still boots.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const memoryStore: Record<string, string> = {};

const canUseSecureStore = Platform.OS === 'ios' || Platform.OS === 'android';

async function setItem(key: string, value: string): Promise<void> {
  if (canUseSecureStore) {
    await SecureStore.setItemAsync(key, value);
  } else {
    memoryStore[key] = value;
  }
}

async function getItem(key: string): Promise<string | null> {
  if (canUseSecureStore) {
    return SecureStore.getItemAsync(key);
  }
  return memoryStore[key] ?? null;
}

async function deleteItem(key: string): Promise<void> {
  if (canUseSecureStore) {
    await SecureStore.deleteItemAsync(key);
  } else {
    delete memoryStore[key];
  }
}

export const tokenStorage = {
  getAccessToken: () => getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => getItem(REFRESH_TOKEN_KEY),
  setAccessToken: (value: string) => setItem(ACCESS_TOKEN_KEY, value),
  setRefreshToken: (value: string) => setItem(REFRESH_TOKEN_KEY, value),
  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await setItem(ACCESS_TOKEN_KEY, accessToken);
    await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  async clear(): Promise<void> {
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};