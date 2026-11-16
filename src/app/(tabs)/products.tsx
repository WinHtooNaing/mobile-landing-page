import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getCategories } from '@/api/categories';
import { getAllProducts } from '@/api/products';
import { ProductCard } from '@/components/product-card';
import { Screen } from '@/components/screen';
import { Loading, StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { useTheme } from '@/hooks/use-theme';

const PAGE_SIZES = [6, 12, 18, 24];

export default function ProductsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const addToCart = useAddToCart();
  const params = useLocalSearchParams<{ categoryId?: string }>();

  const categoryId = params.categoryId ?? undefined;

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [limit, setLimit] = useState(6);
  const [page, setPage] = useState(1);

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: ['products', page, limit, sortOrder, categoryId],
    queryFn: () => getAllProducts(page, limit, sortOrder, categoryId),
  });

  const selectedCategoryName = useMemo(() => {
    if (!categoryId || !categoriesQuery.data) return null;
    return categoriesQuery.data.find((c) => c.id === categoryId)?.name ?? null;
  }, [categoryId, categoriesQuery.data]);

  const pagination = productsQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const goToCategory = (id?: string) => {
    setPage(1);
    router.setParams(id ? { categoryId: id } : { categoryId: '' });
  };

  const changePage = (next: number) => {
    const clamped = Math.min(Math.max(1, next), totalPages);
    setPage(clamped);
  };

  return (
    <View style={styles.root}>
      <Screen scroll>
        <ThemedText type="heading" style={styles.title}>
          Products
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Browse all products{selectedCategoryName ? ` in ${selectedCategoryName}` : ''}
        </ThemedText>

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        <FilterChip
          label="All"
          active={!categoryId}
          onPress={() => goToCategory(undefined)}
        />
        {categoriesQuery.data?.map((category) => (
          <FilterChip
            key={category.id}
            label={category.name}
            active={categoryId === category.id}
            onPress={() => goToCategory(category.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.toolbar}>
        <View style={styles.sortRow}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSortOrder('asc');
              setPage(1);
            }}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortOrder === 'asc' ? theme.primaryMuted : theme.card,
                borderColor: sortOrder === 'asc' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortOrder === 'asc' ? theme.primary : theme.text },
              ]}
            >
              Oldest
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setSortOrder('desc');
              setPage(1);
            }}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortOrder === 'desc' ? theme.primaryMuted : theme.card,
                borderColor: sortOrder === 'desc' ? theme.primary : theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortOrder === 'desc' ? theme.primary : theme.text },
              ]}
            >
              Latest
            </Text>
          </Pressable>
        </View>

        <View style={styles.limitRow}>
          <Text style={[styles.limitLabel, { color: theme.textSecondary }]}>Per page</Text>
          {PAGE_SIZES.map((size) => (
            <Pressable
              key={size}
              accessibilityRole="button"
              onPress={() => {
                setLimit(size);
                setPage(1);
              }}
              style={[
                styles.limitChip,
                {
                  backgroundColor: limit === size ? theme.primary : theme.card,
                  borderColor: limit === size ? theme.primary : theme.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.limitText,
                  { color: limit === size ? theme.primaryForeground : theme.text },
                ]}
              >
                {size}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {productsQuery.isPending ? (
        <Loading label="Loading products..." />
      ) : productsQuery.isError ? (
        <StateView
          icon="alert-circle"
          title="We couldn't load products"
          message="Check your connection and try again."
          actionLabel="Retry"
          onAction={() => productsQuery.refetch()}
        />
      ) : (productsQuery.data?.items.length ?? 0) === 0 ? (
        <StateView
          icon="cube-outline"
          title="No products found"
          message="Try changing your filters or browse another category."
        />
      ) : (
        <>
          <View style={styles.productGrid}>
            {productsQuery.data?.items.map((product) => (
              <View key={product.id} style={styles.productCell}>
                <ProductCard product={product} onPressAdd={addToCart} />
              </View>
            ))}
          </View>

          {pagination && pagination.total > 0 ? (
            <View style={styles.paginationWrap}>
              <Text style={[styles.countLabel, { color: theme.textSecondary }]}>
                Showing {(page - 1) * limit + 1}-
                {(page - 1) * limit + (productsQuery.data?.items.length ?? 0)} of{' '}
                {pagination.total} products
              </Text>

              <View style={styles.pager}>
                <PagerButton
                  icon="chevron-back"
                  disabled={page <= 1}
                  onPress={() => changePage(page - 1)}
                />
                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const pageNumber = firstPage + index;
                  return (
                    <Pressable
                      key={pageNumber}
                      accessibilityRole="button"
                      onPress={() => changePage(pageNumber)}
                      style={[
                        styles.pageButton,
                        {
                          backgroundColor:
                            pageNumber === page ? theme.primary : theme.card,
                          borderColor: pageNumber === page ? theme.primary : theme.border,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.pageButtonText,
                          {
                            color:
                              pageNumber === page ? theme.primaryForeground : theme.text,
                          },
                        ]}
                      >
                        {pageNumber}
                      </Text>
                    </Pressable>
                  );
                })}
                <PagerButton
                  icon="chevron-forward"
                  disabled={page >= totalPages}
                  onPress={() => changePage(page + 1)}
                />
              </View>
            </View>
          ) : null}
        </>
      )}
    </Screen>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: active ? theme.primary : theme.card,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterText,
          { color: active ? theme.primaryForeground : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function PagerButton({
  icon,
  disabled,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  disabled: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.pagerButton,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <Ionicons name={icon} size={18} color={theme.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  title: {
    marginTop: Spacing.two,
  },
  subtitle: {
    marginTop: Spacing.one,
    marginBottom: Spacing.three,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chipRow: {
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  filterChip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  toolbar: {
    marginTop: Spacing.two,
    marginBottom: Spacing.two,
    gap: Spacing.two,
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  sortChip: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  limitLabel: {
    fontSize: 13,
    marginRight: Spacing.one,
  },
  limitChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    borderWidth: 1,
  },
  limitText: {
    fontSize: 13,
    fontWeight: '700',
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
  paginationWrap: {
    marginTop: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  countLabel: {
    fontSize: 13,
  },
  pager: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  pagerButton: {
    height: 40,
    width: 40,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButton: {
    height: 40,
    minWidth: 40,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});