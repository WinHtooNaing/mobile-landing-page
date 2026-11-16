import { Ionicons } from '@expo/vector-icons';
import { forwardRef, useState, type ComponentType, type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: ComponentType<{ size?: number; color?: string }> | keyof typeof Ionicons.glyphMap;
  right?: ReactNode;
  containerStyle?: object;
};

export const Input = forwardRef<any, InputProps>(function Input(
  { label, error, leftIcon, right, style, containerStyle, onFocus, onBlur, ...rest },
  ref
) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const isIonicons = typeof leftIcon === 'string';

  return (
    <View style={containerStyle}>
      {label ? (
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.card,
            borderColor: error ? theme.danger : focused ? theme.primary : theme.border,
          },
        ]}
      >
        {isIonicons ? (
          <Ionicons
            name={leftIcon as keyof typeof Ionicons.glyphMap}
            size={18}
            color={focused ? theme.primary : theme.textSecondary}
            style={styles.leftIcon}
          />
        ) : leftIcon ? (
          (() => {
            const Icon = leftIcon as ComponentType<{ size?: number; color?: string }>;
            return <Icon size={18} color={focused ? theme.primary : theme.textSecondary} />;
          })()
        ) : null}

        <TextInput
          ref={ref}
          placeholderTextColor={theme.textSecondary}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: theme.text }, style]}
          {...rest}
        />

        {right ? <View style={styles.right}>{right}</View> : null}
      </View>

      {error ? (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
  },
  leftIcon: {
    marginRight: Spacing.two,
  },
  right: {
    marginLeft: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: Spacing.three,
  },
  error: {
    marginTop: Spacing.one,
    fontSize: 12,
    fontWeight: '500',
  },
});