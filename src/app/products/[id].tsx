import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getProductDetail } from '@/api/products';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { Loading, StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice } from '@/lib/format';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  const productQuery = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetail(String(id)),
    enabled: !!id,
  });

  const add = async (amount: number) => {
    const product = productQuery.data;
    if (!product) return;
    await addToCart(product, amount);
    setQuantity(1);
  };

  if (productQuery.isPending) {
    return (
      <Screen scroll={false}>
        <Loading label="Loading product..." />
      </Screen>
    );
  }

  if (productQuery.isError || !productQuery.data) {
    return (
      <Screen scroll={false}>
        <StateView
          icon="cube-outline"
          title="Product not found"
          message="The product you are looking for does not exist."
          actionLabel="Back to Products"
          onAction={() => router.replace('/products')}
        />
      </Screen>
    );
  }

  const product = productQuery.data;
  const inStock = product.stock?.availableQuantity > 0;

  return (
    <Screen scroll>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
      >
        <Ionicons name="chevron-back" size={22} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
      </Pressable>

      <Card padded={false} style={styles.card}>
        <View style={[styles.imageWrap, { backgroundColor: theme.cardMuted }]}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            contentFit="contain"
            transition={200}
          />
        </View>

        <View style={styles.content}>
          <ThemedText type="heading">{product.name}</ThemedText>

          <View style={styles.ratingRow}>
            <View style={styles.stars}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Ionicons key={i} name="star" size={18} color={theme.primary} />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: theme.textSecondary }]}>
              {product.discountPercentage > 0
                ? `${Math.round(product.discountPercentage)}% off`
                : 'Featured'}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <ThemedText type="price" themeColor="primary">
              {formatPrice(product.price)}
            </ThemedText>
            {product.originalPrice > 0 && product.originalPrice > product.price ? (
              <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                {formatPrice(product.originalPrice)}
              </Text>
            ) : null}
          </View>

          <View style={styles.stockRow}>
            <View
              style={[
                styles.stockDot,
                { backgroundColor: inStock ? theme.success : theme.danger },
              ]}
            />
            <Text
              style={[
                styles.stockText,
                { color: inStock ? theme.success : theme.danger },
              ]}
            >
              {inStock
                ? `In Stock · ${product.stock.availableQuantity} available`
                : 'Out of Stock'}
            </Text>
          </View>

          <View style={styles.divider} />

          <ThemedText type="smallBold">Product Description</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.description}>
            {product.description ||
              `Discover ${product.name}, a product selected for quality and value.`}
          </ThemedText>

          {inStock ? (
            <View style={styles.quantityRow}>
              <Text style={[styles.quantityLabel, { color: theme.text }]}>Quantity</Text>
              <View style={styles.stepper}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={[styles.stepperBtn, { borderColor: theme.border }]}
                >
                  <Ionicons name="remove" size={18} color={theme.text} />
                </Pressable>
                <Text style={[styles.quantityValue, { color: theme.text }]}>{quantity}</Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() =>
                    setQuantity((q) =>
                      Math.min(product.stock.availableQuantity, q + 1)
                    )
                  }
                  style={[styles.stepperBtn, { borderColor: theme.border }]}
                >
                  <Ionicons name="add" size={18} color={theme.text} />
                </Pressable>
              </View>
            </View>
          ) : null}

          {inStock ? (
            <Button
              title="Add to Cart"
              size="lg"
              fullWidth
              icon="cart-outline"
              style={styles.addBtn}
              onPress={() => add(quantity)}
            />
          ) : null}

          <Button
            title="Continue Shopping"
            variant="outline"
            size="lg"
            fullWidth
            onPress={() => router.push('/products')}
          />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    alignSelf: 'flex-start',
    marginBottom: Spacing.two,
    paddingVertical: Spacing.one,
    paddingRight: Spacing.three,
  },
  backText: {
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    padding: 0,
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.two,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.two,
  },
  originalPrice: {
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  stockDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: Spacing.two,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
  },
  quantityLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  stepperBtn: {
    height: 36,
    width: 36,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  addBtn: {
    marginTop: Spacing.two,
  },
});