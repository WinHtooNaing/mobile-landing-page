import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useToastStore } from '@/lib/toast';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  info: 'information-circle',
};

export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);
  const theme = useTheme();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toasts.length > 0) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [toasts.length, anim]);

  if (toasts.length === 0) return null;

  const current = toasts[toasts.length - 1];
  const accent =
    current.kind === 'success'
      ? theme.success
      : current.kind === 'error'
        ? theme.danger
        : theme.primary;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          { backgroundColor: theme.card, borderColor: accent },
        ]}
      >
        <Ionicons name={ICONS[current.kind]} size={20} color={accent} />
        <Text numberOfLines={2} style={[styles.text, { color: theme.text }]}>
          {current.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    zIndex: 1000,
    width: '90%',
    maxWidth: 420,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
});