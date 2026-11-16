import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
};

/**
 * A layout wrapper that centres content on wider screens and constrains the
 * content width so the app feels at home on tablets too.
 */
export function Screen({ children, scroll = true, contentStyle, edges }: ScreenProps) {
  const theme = useTheme();
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const content = (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.background },
        contentStyle,
        {
          opacity: entrance,
          transform: [
            {
              translateY: entrance.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );

  if (scroll) {
    return (
      <SafeAreaView style={styles.flex} edges={edges ?? ['left', 'right']}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.scrollContainer, { backgroundColor: theme.background }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.flex, { backgroundColor: theme.background }]}
      edges={edges ?? ['left', 'right']}
    >
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    width: '100%',
    maxWidth: MaxContentWidth,
    flexGrow: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.six,
  },
});