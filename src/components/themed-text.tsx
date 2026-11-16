import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?:
    | 'default'
    | 'title'
    | 'subtitle'
    | 'heading'
    | 'body'
    | 'small'
    | 'smallBold'
    | 'link'
    | 'code'
    | 'price';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  smallBold: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  heading: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
});