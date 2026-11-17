import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * App-wide configuration.
 *
 * The API base URL is read from the EXPO_PUBLIC_API_URL environment variable
 * (set it in a `.env` file). For native development, a localhost URL is
 * redirected to the host running Expo; Android emulators use their host
 * loopback address when Expo is also using localhost.
 */
const configuredApiUrl =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";
const apiUrl = new URL(configuredApiUrl);
const isLoopback = (hostname: string) =>
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";

if (Platform.OS !== "web" && isLoopback(apiUrl.hostname)) {
  const expoHostUri = Constants.expoConfig?.hostUri;
  const expoHost = expoHostUri
    ? new URL(`http://${expoHostUri}`).hostname
    : undefined;

  if (expoHost && !isLoopback(expoHost)) {
    apiUrl.hostname = expoHost;
  } else if (Platform.OS === "android") {
    apiUrl.hostname = "10.0.2.2";
  }
}

export const API_URL = apiUrl.toString().replace(/\/$/, "");

export const APP_NAME = "Tech Haven";

export const CONTACT = {
  email: "support@techhaven.com",
  phone: "+95 9 123 456 789",
  phoneHref: "tel:+959123456789",
  address: "Yangon, Myanmar",
  hours: "Mon – Fri, 8:30 AM – 5:00 PM",
} as const;

export const PAYMENT_PROVIDERS = [
  {
    code: "KBZ_PAY",
    name: "KBZ Pay",
    detail: "Pay with KBZPay",
    mark: "K",
    colors: "bg-blue-600",
  },
  {
    code: "WAVE_MONEY",
    name: "Wave Pay",
    detail: "Pay with Wave Money",
    mark: "W",
    colors: "bg-yellow-500",
  },
] as const;

export type PaymentProviderCode = (typeof PAYMENT_PROVIDERS)[number]["code"];
