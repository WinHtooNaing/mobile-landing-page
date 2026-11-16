import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CORE_VALUES: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Quality & Trust',
    desc: 'We focus on quality products and transparent information so customers can shop with confidence.',
  },
  {
    icon: 'heart-outline',
    title: 'Customer First',
    desc: 'We put customers first by making their shopping experience simple, helpful, and enjoyable.',
  },
  {
    icon: 'bulb-outline',
    title: 'Innovation',
    desc: 'We embrace new technologies and ideas to make discovering the right products easier.',
  },
  {
    icon: 'people-outline',
    title: 'Community',
    desc: 'We build lasting relationships with customers through reliable service and support.',
  },
];

const BENEFITS: { icon: keyof typeof Ionicons.glyphMap; title: string; desc: string }[] = [
  {
    icon: 'shield-checkmark-outline',
    title: 'Quality Products',
    desc: 'Explore carefully selected technology products with clear, helpful information.',
  },
  {
    icon: 'cube-outline',
    title: 'Convenient Shopping',
    desc: 'Browse products and discover options that suit your needs from wherever you are.',
  },
  {
    icon: 'headset-outline',
    title: 'Helpful Support',
    desc: 'Our contact team is available to answer your questions and guide your experience.',
  },
  {
    icon: 'flash-outline',
    title: 'Modern Technology',
    desc: 'Discover modern electronics and technology products in one convenient place.',
  },
];

export default function AboutScreen() {
  const theme = useTheme();

  return (
    <Screen scroll>
      <View style={[styles.hero, { backgroundColor: theme.primaryMuted }]}>
        <ThemedText themeColor="primary" style={styles.eyebrow}>
          GET TO KNOW US
        </ThemedText>
        <ThemedText type="title" style={styles.heroTitle}>
          Technology That{'\n'}
          <ThemedText themeColor="primary">Moves You Forward.</ThemedText>
        </ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.heroText}>
          Welcome to Tech Haven, your destination for discovering modern
          technology and electronics. Finding the right technology should be
          simple, convenient, and accessible to everyone.
        </ThemedText>
      </View>

      <Card style={styles.missionCard}>
        <View style={[styles.iconBox, { backgroundColor: theme.primaryMuted }]}>
          <Ionicons name="flash" size={28} color={theme.primary} />
        </View>
        <ThemedText type="subtitle">Making Technology Easier</ThemedText>
        <ThemedText themeColor="textSecondary" style={styles.missionText}>
          At Tech Haven we bring technology products together in one place,
          helping customers discover options that match their interests and
          needs — from everyday electronics to modern tech accessories.
        </ThemedText>
        <View style={styles.checks}>
          {['Easy product discovery', 'Clear product information', 'Customer-focused service'].map(
            (item) => (
              <View key={item} style={styles.checkRow}>
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
                <ThemedText style={styles.checkText}>{item}</ThemedText>
              </View>
            )
          )}
        </View>
      </Card>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Our Mission &amp; Vision
        </ThemedText>
        <View style={styles.twoCol}>
          <Card style={styles.pairCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="locate-outline" size={24} color={theme.primary} />
            </View>
            <ThemedText type="smallBold" style={styles.pairTitle}>
              Our Mission
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.pairText}>
              Make technology shopping simple by helping customers explore
              products, understand their options, and make informed decisions.
            </ThemedText>
          </Card>
          <Card style={styles.pairCard}>
            <View style={[styles.iconBox, { backgroundColor: theme.primaryMuted }]}>
              <Ionicons name="eye-outline" size={24} color={theme.primary} />
            </View>
            <ThemedText type="smallBold" style={styles.pairTitle}>
              Our Vision
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.pairText}>
              Become a trusted destination for discovering technology products
              with an accessible, customer-focused experience.
            </ThemedText>
          </Card>
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Our Core Values
        </ThemedText>
        <View style={styles.twoCol}>
          {CORE_VALUES.map((value) => (
            <Card key={value.title} style={styles.valueCard}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name={value.icon} size={20} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.pairTitle}>
                {value.title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.pairText}>
                {value.desc}
              </ThemedText>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Why Choose Us?
        </ThemedText>
        <View style={styles.twoCol}>
          {BENEFITS.map((benefit) => (
            <Card key={benefit.title} style={styles.valueCard}>
              <View style={[styles.iconBox, { backgroundColor: theme.primaryMuted }]}>
                <Ionicons name={benefit.icon} size={20} color={theme.primary} />
              </View>
              <ThemedText type="smallBold" style={styles.pairTitle}>
                {benefit.title}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.pairText}>
                {benefit.desc}
              </ThemedText>
            </Card>
          ))}
        </View>
      </View>

      <View style={[styles.ctaCard, { backgroundColor: theme.primary }]}>
        <ThemedText type="subtitle" style={[styles.ctaTitle, { color: theme.primaryForeground }]}>
          Let's Find Your Next Favorite Tech
        </ThemedText>
        <ThemedText
          style={[styles.ctaText, { color: theme.primaryForeground + 'cc' }]}
        >
          Explore our product collection or contact our team if you need help
          finding the right technology for your needs.
        </ThemedText>
        <View style={styles.ctaButtons}>
          <Button
            title="Browse Products"
            size="lg"
            onPress={() => router.push('/products')}
          />
          <Button
            title="Get in Touch"
            variant="outline"
            size="lg"
            onPress={() => router.push('/contact')}
          />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
  },
  heroText: {
    fontSize: 14,
    lineHeight: 21,
  },
  missionCard: {
    gap: Spacing.two,
  },
  iconBox: {
    height: 48,
    width: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionText: {
    fontSize: 14,
    lineHeight: 21,
  },
  checks: {
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  checkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: Spacing.five,
    gap: Spacing.three,
  },
  sectionTitle: {
    fontSize: 20,
  },
  twoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  pairCard: {
    width: '47%',
    flexGrow: 1,
    gap: Spacing.one,
  },
  valueCard: {
    width: '47%',
    flexGrow: 1,
    gap: Spacing.one,
  },
  pairTitle: {
    marginTop: Spacing.one,
  },
  pairText: {
    fontSize: 12,
    lineHeight: 18,
  },
  ctaCard: {
    marginTop: Spacing.five,
    borderRadius: Radius.xl,
    padding: Spacing.four,
    gap: Spacing.two,
    alignItems: 'center',
  },
  ctaTitle: {
    textAlign: 'center',
  },
  ctaText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  ctaButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
});