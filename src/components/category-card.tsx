import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Category } from '@/types';

export type CategoryCardProps = {
  category: Category;
};

export function CategoryCard({ category }: CategoryCardProps) {
  const theme = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const onPress = () => {
    router.push({
      pathname: '/products',
      params: { categoryId: category.id },
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, pressed && { opacity: 0.9 }]}
    >
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: theme.glass, borderColor: theme.glassBorder },
          {
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
        <View style={[styles.footer, { borderTopColor: theme.border }]}>
          <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
            {category.name}
          </Text>
          <Text style={[styles.arrow, { color: theme.primary }]}>→</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  arrow: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: Spacing.two,
  },
});