import { DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack } from 'expo-router/stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/components/app-header';
import { ToastHost } from '@/components/toast-host';
import { Colors } from '@/constants/theme';
import { AppProviders } from '@/providers/AppProviders';
import { useAuthStore } from '@/store/auth-store';

SplashScreen.preventAutoHideAsync();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
  },
};

function RootNavigator() {
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return (
    <ThemeProvider value={navTheme}>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors.light.background }}
        edges={['top']}
      >
        <AppHeader />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="cart" options={{ headerShown: false }} />
          <Stack.Screen name="orders" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
      <ToastHost />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProviders>
          <RootNavigator />
        </AppProviders>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}