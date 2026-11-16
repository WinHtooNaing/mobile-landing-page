import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export function Loading({ label = 'Loading...' }: { label?: string }) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.primary} />
      <ThemedText themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
    </View>
  );
}

export type StateViewProps = {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateView({ icon, title, message, actionLabel, onAction }: StateViewProps) {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      {icon ? (
        <View style={[styles.iconCircle, { backgroundColor: theme.primaryMuted }]}>
          <Ionicons name={icon} size={32} color={theme.primary} />
        </View>
      ) : null}
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      {message ? (
        <ThemedText themeColor="textSecondary" style={styles.message}>
          {message}
        </ThemedText>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <ThemedText
            type="link"
            themeColor="primary"
            onPress={onAction}
            style={styles.actionText}
          >
            {actionLabel}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
    minHeight: 200,
  },
  label: {
    marginTop: Spacing.two,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  action: {
    marginTop: Spacing.two,
  },
  actionText: {
    textDecorationLine: 'underline',
  },
});