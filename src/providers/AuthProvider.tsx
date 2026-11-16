import { useEffect, type ReactNode } from 'react';

import { checkCurrentUser } from '@/api/auth';
import { setAuthFailureHandler } from '@/api/axios-instance';
import { useAuthStore } from '@/store/auth-store';
import { tokenStorage } from '@/lib/token-storage';

/**
 * Restores the current user session on launch and wires the global auth-failure
 * handler used by the axios client to clear the session when a refresh fails.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    const getCurrentUser = async () => {
      const accessToken = await tokenStorage.getAccessToken();
      if (!accessToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await checkCurrentUser();
        if (!response.success || response.data?.role !== 'CUSTOMER') {
          await tokenStorage.clear();
          setUser(null);
          return;
        }

        const { id, name, email, phone, role } = response.data;
        setUser({ id, name, email, phone, role });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void getCurrentUser();

    setAuthFailureHandler(() => {
      setUser(null);
    });

    return () => setAuthFailureHandler(null);
  }, [setLoading, setUser]);

  return <>{children}</>;
}