import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getAddToCartItems } from '@/api/cart';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAuthStore } from '@/store/auth-store';

/**
 * Shared app navigation with brand, cart count, account shortcuts, and routes.
 */
export function AppHeader() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const cartQuery = useQuery({
    queryKey: ['cart-count'],
    queryFn: getAddToCartItems,
    enabled: user?.role === 'CUSTOMER',
    staleTime: 0,
  });

  const cartCount =
    cartQuery.data?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.glass,
          borderBottomColor: theme.glassBorder,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Tech Haven home"
          onPress={() => router.push('/')}
          style={({ pressed }) => [styles.brand, pressed && { opacity: 0.8 }]}
        >
          <Image
            source={require('@/assets/images/techhaven/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </Pressable>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Shopping cart"
            onPress={() => router.push('/cart')}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: theme.glassControl, borderColor: theme.glassBorder },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="cart-outline" size={20} color={theme.primary} />
            {cartCount > 0 ? (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            ) : null}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Orders"
            onPress={() => router.push('/orders')}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: theme.glassControl, borderColor: theme.glassBorder },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="receipt-outline" size={20} color={theme.primary} />
          </Pressable>

          {user?.role === 'CUSTOMER' ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Account"
              onPress={() => router.push('/orders')}
              style={({ pressed }) => [
                styles.avatar,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.avatarText, { color: Colors.light.primaryForeground }]}>
                {user.name.slice(0, 1).toUpperCase()}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/login')}
              style={({ pressed }) => [
                styles.loginButton,
                { backgroundColor: theme.primary },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={[styles.loginText, { color: Colors.light.primaryForeground }]}>
                Login
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.navigation}
      >
        {([
          { label: 'Home', path: '/' as const, icon: 'home-outline' as const },
          { label: 'Products', path: '/products' as const, icon: 'grid-outline' as const },
          { label: 'About', path: '/about' as const, icon: 'information-circle-outline' as const },
          { label: 'Contact', path: '/contact' as const, icon: 'chatbubble-ellipses-outline' as const },
        ]).map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            onPress={() => router.push(item.path)}
            style={({ pressed }) => [
              styles.navItem,
              {
                backgroundColor: theme.glassControl,
                borderColor: theme.glassBorder,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name={item.icon} size={15} color={theme.primary} />
            <Text style={[styles.navLabel, { color: theme.text }]}>{item.label}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    zIndex: 1,
    elevation: 8,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    borderBottomWidth: 1,
    paddingBottom: Spacing.two,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  brand: {
    flexShrink: 1,
    maxWidth: 120,
  },
  logo: {
    width: 100,
    height: 36,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  navItem: {
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    borderRadius: 18,
    borderWidth: 1,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  avatar: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
  },
  loginButton: {
    height: 40,
    paddingHorizontal: Spacing.four,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '700',
  },
});