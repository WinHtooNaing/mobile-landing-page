import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/card';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types';

export type ProductCardProps = {
  product: Product;
  onPressAdd?: (product: Product) => void;
  addingId?: string | null;
};

export function ProductCard({ product, onPressAdd, addingId }: ProductCardProps) {
  const theme = useTheme();
  const isAdding = addingId === product.id;
  const inStock = product.stock?.availableQuantity > 0;

  const open = () => {
    router.push({ pathname: '/products/[id]', params: { id: product.id } });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${product.name}`}
      onPress={open}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.9 }]}
    >
      <Card padded={false} style={styles.card}>
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          {product.discountPercentage > 0 ? (
            <View style={[styles.badge, { backgroundColor: theme.danger }]}>
              <Text style={styles.badgeText}>-{Math.round(product.discountPercentage)}%</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
            {product.name}
          </Text>

          <View style={styles.priceRow}>
            {product.originalPrice > 0 && product.originalPrice > product.price ? (
              <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                {formatPrice(product.originalPrice)}
              </Text>
            ) : null}
            <Text style={[styles.price, { color: theme.primary }]}>
              {formatPrice(product.price)}
            </Text>
          </View>

          <View style={styles.footer}>
            <Text
              style={[
                styles.stock,
                { color: inStock ? theme.success : theme.danger },
              ]}
            >
              {inStock ? `${product.stock.availableQuantity} in stock` : 'Out of stock'}
            </Text>

            {onPressAdd ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add ${product.name} to cart`}
                disabled={!inStock || isAdding}
                onPress={() => onPressAdd(product)}
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: theme.primaryMuted },
                  (!inStock || isAdding) && { opacity: 0.5 },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <Ionicons name="cart-outline" size={18} color={theme.primary} />
              </Pressable>
            ) : null}
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  imageWrap: {
    position: 'relative',
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: 150,
  },
  badge: {
    position: 'absolute',
    top: Spacing.two,
    right: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.one,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.one,
  },
  stock: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    height: 36,
    width: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});