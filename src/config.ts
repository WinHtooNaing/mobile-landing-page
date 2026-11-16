/**
 * App-wide configuration.
 *
 * The API base URL is read from the EXPO_PUBLIC_API_URL environment variable
 * (set it in a `.env` file) and falls back to the Android emulator loopback
 * address for the local backend used by the web app.
 */
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:3000/api';

export const APP_NAME = 'Tech Haven';

export const CONTACT = {
  email: 'support@techhaven.com',
  phone: '+95 9 123 456 789',
  phoneHref: 'tel:+959123456789',
  address: 'Yangon, Myanmar',
  hours: 'Mon – Fri, 8:30 AM – 5:00 PM',
} as const;

export const PAYMENT_PROVIDERS = [
  {
    code: 'KBZ_PAY',
    name: 'KBZ Pay',
    detail: 'Pay with KBZPay',
    mark: 'K',
    colors: 'bg-blue-600',
  },
  {
    code: 'WAVE_MONEY',
    name: 'Wave Pay',
    detail: 'Pay with Wave Money',
    mark: 'W',
    colors: 'bg-yellow-500',
  },
] as const;

export type PaymentProviderCode = (typeof PAYMENT_PROVIDERS)[number]['code'];