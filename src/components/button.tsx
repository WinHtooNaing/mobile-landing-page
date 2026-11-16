import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = PressableProps & {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;

  const variantStyles = {
    primary: { backgroundColor: theme.primary, borderColor: theme.primary },
    outline: { backgroundColor: 'transparent', borderColor: theme.primary },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    danger: { backgroundColor: theme.danger, borderColor: theme.danger },
  }[variant];

  const textColor =
    variant === 'primary' || variant === 'danger'
      ? theme.primaryForeground
      : theme.primary;

  const iconColor = textColor;

  const containerStyle = [
    styles.base,
    variantStyles,
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [containerStyle, pressed && !isDisabled && styles.pressed]}
      {...rest}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={iconColor}
            style={icon || iconRight ? styles.spinnerWithIcon : undefined}
          />
        ) : (
          icon && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 18}
              color={iconColor}
              style={styles.iconLeft}
            />
          )
        )}
        <Text numberOfLines={1} style={[styles.label, styles[`labelSize_${size}`], { color: textColor }]}>
          {title}
        </Text>
        {!loading && iconRight && (
          <Ionicons
            name={iconRight}
            size={size === 'sm' ? 16 : 18}
            color={iconColor}
            style={styles.iconRight}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  size_sm: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Radius.sm,
  },
  size_md: {
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  size_lg: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
  },
  labelSize_sm: {
    fontSize: 13,
  },
  labelSize_md: {
    fontSize: 15,
  },
  labelSize_lg: {
    fontSize: 16,
  },
  iconLeft: {
    marginRight: Spacing.two,
  },
  iconRight: {
    marginLeft: Spacing.two,
  },
  spinnerWithIcon: {
    marginRight: Spacing.two,
  },
});