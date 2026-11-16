import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
};

export function Card({ children, style, padded = true }: CardProps) {
  const theme = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 360,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.glass,
          borderColor: theme.glassBorder,
        },
        padded && styles.padded,
        style,
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
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#0f172a',
    shadowOpacity: 0.06,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  padded: {
    padding: Spacing.four,
  },
});