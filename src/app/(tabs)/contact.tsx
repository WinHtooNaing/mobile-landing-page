import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CONTACT } from '@/config';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const DETAILS: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  desc: string;
  value: string;
  href?: string;
}[] = [
  {
    icon: 'mail-outline',
    title: 'Email Us',
    desc: 'Send us an email anytime.',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: 'call-outline',
    title: 'Call Us',
    desc: 'Our team is ready to help.',
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
  },
  {
    icon: 'location-outline',
    title: 'Visit Us',
    desc: 'Come and visit our store.',
    value: CONTACT.address,
  },
  {
    icon: 'time-outline',
    title: 'Business Hours',
    desc: "We're available during:",
    value: CONTACT.hours,
  },
];

export default function ContactScreen() {
  const theme = useTheme();

  const open = (href?: string) => {
    if (href) Linking.openURL(href).catch(() => {});
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: theme.primaryMuted }]}>
          <Ionicons name="chatbubble-ellipses-outline" size={14} color={theme.primary} />
          <Text style={[styles.badgeText, { color: theme.primary }]}>
            We'd Love to Hear From You
          </Text>
        </View>
        <ThemedText type="title" style={styles.title}>
          Contact <ThemedText themeColor="primary">Us</ThemedText>
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.subtitle}>
          Have a question about our products or need help with an order? Our
          team at Tech Haven is here to help you find the right technology.
        </ThemedText>
      </View>

      <Card style={styles.card}>
        <ThemedText type="subtitle">Get in Touch</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.cardSub}>
          Whether you have questions, feedback, or need assistance, we're always
          happy to hear from you.
        </ThemedText>

        <View style={styles.details}>
          {DETAILS.map((item) => {
            const content = (
              <>
                <View style={[styles.detailIcon, { backgroundColor: theme.primaryMuted }]}>
                  <Ionicons name={item.icon} size={20} color={theme.primary} />
                </View>
                <View style={styles.detailBody}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText themeColor="textSecondary" style={styles.detailDesc}>
                    {item.desc}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>{item.value}</ThemedText>
                </View>
              </>
            );

            if (item.href) {
              return (
                <Pressable
                  key={item.title}
                  accessibilityRole="button"
                  onPress={() => open(item.href)}
                  style={({ pressed }) => [styles.detailRow, pressed && { opacity: 0.7 }]}
                >
                  {content}
                </Pressable>
              );
            }
            return (
              <View key={item.title} style={styles.detailRow}>
                {content}
              </View>
            );
          })}
        </View>
      </Card>

      <Card style={styles.ctaCard}>
        <ThemedText type="subtitle" style={styles.ctaTitle}>
          Still Have Questions?
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.ctaText}>
          We're happy to help you find the right products and solutions for your
          needs. Explore our collection or reach out any time.
        </ThemedText>
        <Button
          title="Explore Products"
          size="lg"
          iconRight="arrow-forward"
          onPress={() => router.push('/products')}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.three,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  cardSub: {
    fontSize: 14,
    lineHeight: 21,
  },
  details: {
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  detailRow: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'flex-start',
  },
  detailIcon: {
    height: 44,
    width: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailBody: {
    flex: 1,
    gap: 2,
  },
  detailDesc: {
    fontSize: 13,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  ctaCard: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  ctaTitle: {
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
});