import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
} from 'react-native';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SLIDES = [
  {
    title: 'Unleash Innovation in Every Byte',
    description:
      'Explore a world of cutting-edge technology. Discover the latest devices built for your lifestyle.',
    label: 'Next generation technology',
    image: require('@/assets/images/techhaven/laptop.png'),
    icon: 'laptop-outline' as const,
  },
  {
    title: 'Experience the Future in Your Hands',
    description:
      'Discover powerful smartphones with stunning designs, incredible performance, and endless possibilities.',
    label: 'Smartphone collection',
    image: require('@/assets/images/techhaven/iphone.png'),
    icon: 'phone-portrait-outline' as const,
  },
];

const AUTO_PLAY_MS = 5500;

export function HeroCarousel() {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const indexRef = useRef(0);
  const imageFloat = useRef(new Animated.Value(0)).current;
  const isCompact = windowWidth < 600;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(imageFloat, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(imageFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [imageFloat]);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % SLIDES.length;
      indexRef.current = next;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, [width]);

  const goTo = (next: number) => {
    const normalized = (next + SLIDES.length) % SLIDES.length;
    indexRef.current = normalized;
    setIndex(normalized);
    scrollRef.current?.scrollTo({ x: normalized * width, animated: true });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    setWidth(nextWidth);
    scrollRef.current?.scrollTo({ x: indexRef.current * nextWidth, animated: false });
  };

  const onScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width <= 0) return;
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    indexRef.current = next;
    setIndex(next);
  };

  const floatStyle = {
    transform: [
      {
        translateY: imageFloat.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -8],
        }),
      },
    ],
  };

  return (
    <View onLayout={onLayout} style={styles.wrap}>
      <View
        style={[
          styles.container,
          { backgroundColor: theme.glass, borderColor: theme.glassBorder },
        ]}
      >
        {width > 0 ? (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScrollEnd}
            scrollEventThrottle={16}
          >
            {SLIDES.map((slide) => (
              <View
                key={slide.label}
                style={[
                  styles.slide,
                  { width },
                  isCompact ? styles.compactSlide : styles.wideSlide,
                ]}
              >
                <View style={[styles.textColumn, isCompact && styles.compactText]}>
                  <View
                    style={[
                      styles.eyebrow,
                      { backgroundColor: theme.primaryMuted, borderColor: theme.glassBorder },
                    ]}
                  >
                    <Ionicons name={slide.icon} size={14} color={theme.primary} />
                    <ThemedText themeColor="primary" style={styles.eyebrowText}>
                      {slide.label}
                    </ThemedText>
                  </View>
                  <ThemedText type="title" style={[styles.title, isCompact && styles.compactTitle]}>
                    {slide.title}
                  </ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.description}>
                    {slide.description}
                  </ThemedText>
                  <View style={styles.ctaRow}>
                    <Button
                      title="Shop Now"
                      size="lg"
                      iconRight="arrow-forward"
                      onPress={() => router.push('/products')}
                    />
                  </View>
                </View>

                <View style={[styles.imageStage, isCompact && styles.compactImageStage]}>
                  <View
                    style={[
                      styles.imageGlow,
                      { backgroundColor: theme.primaryMuted, borderColor: theme.glassBorder },
                    ]}
                  />
                  <Animated.View style={[styles.imageFrame, floatStyle]}>
                    <Image
                      source={slide.image}
                      style={styles.image}
                      contentFit="contain"
                      transition={400}
                      accessibilityLabel={slide.label}
                    />
                  </Animated.View>
                  <View style={[styles.imageTag, { backgroundColor: theme.glass }]}>
                    <Ionicons name="sparkles" size={14} color={theme.primary} />
                    <ThemedText style={styles.imageTagText}>Discover what’s next</ThemedText>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : null}

        <View style={styles.controls}>
          <View style={styles.dotsRow}>
            {SLIDES.map((slide, i) => (
              <Pressable
                key={slide.label}
                accessibilityRole="button"
                accessibilityLabel={`Go to slide ${i + 1}`}
                accessibilityState={{ selected: i === index }}
                onPress={() => goTo(i)}
                hitSlop={8}
                style={[
                  styles.dot,
                  {
                    backgroundColor: i === index ? theme.primary : theme.border,
                    width: i === index ? 26 : 8,
                  },
                ]}
              />
            ))}
          </View>
          <View style={styles.arrows}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous slide"
              onPress={() => goTo(index - 1)}
              style={[styles.arrowButton, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}
            >
              <Ionicons name="chevron-back" size={16} color={theme.text} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next slide"
              onPress={() => goTo(index + 1)}
              style={[styles.arrowButton, { backgroundColor: theme.glass, borderColor: theme.glassBorder }]}
            >
              <Ionicons name="chevron-forward" size={16} color={theme.text} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  container: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  slide: {
    minHeight: 440,
    padding: Spacing.four,
    paddingBottom: 76,
    justifyContent: 'center',
    gap: Spacing.three,
  },
  wideSlide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactSlide: {
    flexDirection: 'column',
    alignItems: 'stretch',
    minHeight: 590,
    padding: Spacing.three,
    paddingBottom: 76,
    gap: Spacing.two,
  },
  textColumn: {
    flex: 1,
    gap: Spacing.three,
    justifyContent: 'center',
  },
  compactText: {
    flex: 0,
    gap: Spacing.two,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  eyebrowText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    lineHeight: 39,
  },
  compactTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
  },
  ctaRow: {
    marginTop: Spacing.one,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
  imageStage: {
    flex: 0.9,
    minHeight: 300,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  compactImageStage: {
    flex: 1,
    minHeight: 245,
    marginTop: Spacing.one,
  },
  imageGlow: {
    position: 'absolute',
    width: '78%',
    aspectRatio: 1,
    maxWidth: 300,
    borderRadius: Radius.pill,
    borderWidth: 1,
    opacity: 0.8,
  },
  imageFrame: {
    width: '100%',
    height: 270,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageTag: {
    position: 'absolute',
    bottom: 4,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.24)',
  },
  imageTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: Spacing.three,
    left: Spacing.three,
    right: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: Radius.pill,
  },
  arrows: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  arrowButton: {
    height: 34,
    width: 34,
    borderWidth: 1,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
