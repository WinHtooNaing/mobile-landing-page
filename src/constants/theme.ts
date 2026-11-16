/**
 * Design tokens for the Tech Haven app.
 *
 * Colors mirror the brand used by the cms-landing-page web app: a blue/teal
 * primary (oklch(0.52 0.105 223.128) ≈ #0b87d6) with light and dark surfaces.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    background: '#ffffff',
    backgroundElement: '#ffffff',
    backgroundSelected: '#e2e8f0',
    primary: '#0b87d6',
    primaryForeground: '#ffffff',
    primaryMuted: '#e0f2fe',
    border: '#e2e8f0',
    danger: '#e11d48',
    success: '#059669',
    warning: '#d97706',
    card: '#ffffff',
    cardMuted: '#f1f5f9',
    glass: 'rgba(255,255,255,0.88)',
    glassControl: 'rgba(255,255,255,0.55)',
    glassBorder: 'rgba(148,163,184,0.28)',
  },
  dark: {
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    background: '#0f172a',
    backgroundElement: '#1e293b',
    backgroundSelected: '#334155',
    primary: '#38bdf8',
    primaryForeground: '#082f49',
    primaryMuted: '#0c4a6e',
    border: '#334155',
    danger: '#fb7185',
    success: '#34d399',
    warning: '#fbbf24',
    card: '#1e293b',
    cardMuted: '#334155',
    glass: 'rgba(15,23,42,0.90)',
    glassControl: 'rgba(51,65,85,0.62)',
    glassBorder: 'rgba(148,163,184,0.18)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;