import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { getCategories } from '@/api/categories';
import { getNewCollection } from '@/api/products';
import { Card } from '@/components/card';
import { CategoryCard } from '@/components/category-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductCard } from '@/components/product-card';
import { Screen } from '@/components/screen';
import { Loading } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Radius, Spacing } from '@/constants/theme';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();
  const addToCart = useAddToCart();

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const collectionQuery = useQuery({
    queryKey: ['collection'],
    queryFn: getNewCollection,
  });

  const newCollection = useMemo(
    () => collectionQuery.data?.items ?? [],
    [collectionQuery.data]
  );

  return (
    <ThemedView style={styles.flex}>
      <Screen scroll>
        <HeroCarousel />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="subtitle">Shop By Category</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.sectionSubtitle}>
                Explore our wide range of products
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/products')}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.7 }]}
            >
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </Pressable>
          </View>

          {categoriesQuery.isPending ? (
            <Loading label="Loading categories..." />
          ) : categoriesQuery.isError ? (
            <ThemedText themeColor="textSecondary">
              Could not load categories. Pull to refresh later.
            </ThemedText>
          ) : (
            <View style={styles.categoryGrid}>
              {categoriesQuery.data?.map((category) => (
                <View key={category.id} style={styles.categoryCell}>
                  <CategoryCard category={category} />
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="subtitle">New Collections</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.sectionSubtitle}>
                Fresh arrivals picked for you
              </ThemedText>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/products')}
              style={({ pressed }) => [styles.seeAll, pressed && { opacity: 0.7 }]}
            >
              <Text style={[styles.seeAllText, { color: theme.primary }]}>See All</Text>
            </Pressable>
          </View>

          {collectionQuery.isPending ? (
            <Loading label="Loading products..." />
          ) : collectionQuery.isError ? (
            <ThemedText themeColor="textSecondary">Could not load products.</ThemedText>
          ) : (
            <View style={styles.productGrid}>
              {newCollection.map((product) => (
                <View key={product.id} style={styles.productCell}>
                  <ProductCard
                    product={product}
                    onPressAdd={addToCart}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
      </Screen>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  section: {
    marginTop: Spacing.five,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  sectionSubtitle: {
    marginTop: 2,
    fontSize: 13,
  },
  seeAll: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: '#0b87d6',
    backgroundColor: 'rgba(11,135,214,0.06)',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  categoryCell: {
    width: '47%',
    flexGrow: 1,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  productCell: {
    width: '47%',
    flexGrow: 1,
  },
});