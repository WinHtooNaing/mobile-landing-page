import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { login } from '@/api/auth';
import { getApiErrorMessage } from '@/api/axios-instance';
import { Button } from '@/components/button';
import { Input } from '@/components/input';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { toast } from '@/lib/toast';
import { tokenStorage } from '@/lib/token-storage';
import { useAuthStore } from '@/store/auth-store';

const emailValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function LoginScreen() {
  const theme = useTheme();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = async () => {
    const nextErrors: { email?: string; password?: string } = {};
    if (!emailValid(email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await login({ email: email.trim(), password });
      if (!response.success || !response.data?.accessToken || !response.data?.refreshToken) {
        throw new Error(response.message || 'Login failed.');
      }
      const user = response.data.user;
      if (!user || user.role !== 'CUSTOMER') {
        throw new Error('This account is not a customer account.');
      }

      await tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken);
      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
      toast.success(`Welcome back, ${user.name}!`);
      router.replace('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not sign in.'));
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
            <Ionicons name="flash" size={30} color={theme.primary} />
          </View>
          <ThemedText type="title" style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Sign in to continue shopping at Tech Haven.
          </ThemedText>

          <View style={styles.form}>
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
              title="Sign In"
              size="lg"
              fullWidth
              loading={loading}
              onPress={submit}
            />
          </View>

          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary">Don't have an account? </ThemedText>
            <ThemedText
              type="link"
              themeColor="primary"
              onPress={() => router.push('/register')}
            >
              Create account
            </ThemedText>
          </View>

          <ThemedText themeColor="textSecondary" style={styles.terms}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </ThemedText>
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
    fontSize: 25,
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
  terms: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 320,
    marginTop: Spacing.two,
  },
});