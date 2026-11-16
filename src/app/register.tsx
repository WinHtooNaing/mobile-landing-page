import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { register } from '@/api/auth';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/lib/toast';

const emailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
};

export default function RegisterScreen() {
  const theme = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const submit = async () => {
    const nextErrors: FieldErrors = {};
    if (name.trim().length === 0) nextErrors.name = 'Name is required.';
    if (!emailValid(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (phone.trim().length < 7) nextErrors.phone = 'Enter a valid phone number.';
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      if (!response.success) {
        throw new Error(response.message || 'Registration failed.');
      }
      toast.success('Account created successfully! Please sign in.');
      router.replace('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.kav}
      >
        <View style={styles.inner}>
          <View style={[styles.logoCircle, { backgroundColor: theme.primaryMuted }]}>
            <Ionicons name="person-add-outline" size={30} color={theme.primary} />
          </View>
          <ThemedText type="title" style={styles.title}>
            Create an account
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Join Tech Haven and discover your next favorite tech.
          </ThemedText>

          <View style={styles.form}>
            <Input
              label="Name"
              leftIcon="person-outline"
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <Input
              label="Email"
              leftIcon="mail-outline"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <Input
              label="Phone Number"
              leftIcon="call-outline"
              placeholder="09 123 456 789"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
            />
            <Input
              label="Password"
              leftIcon="lock-closed-outline"
              placeholder="Enter your password"
              secureTextEntry={secure}
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              right={
                <Ionicons
                  name={secure ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={theme.textSecondary}
                  onPress={() => setSecure((s) => !s)}
                />
              }
            />

            <Button
              title="Create Account"
              size="lg"
              fullWidth
              loading={loading}
              onPress={submit}
            />
          </View>

          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary">Already have an account? </ThemedText>
            <ThemedText
              type="link"
              themeColor="primary"
              onPress={() => router.push('/login')}
            >
              Sign in
            </ThemedText>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  inner: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.six,
  },
  logoCircle: {
    height: 72,
    width: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },
  form: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'stretch',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
});