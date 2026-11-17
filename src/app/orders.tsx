import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { getOrders } from "@/api/orders";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Screen } from "@/components/screen";
import { Loading, StateView } from "@/components/state-view";
import { ThemedText } from "@/components/themed-text";
import { Radius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { formatDate } from "@/lib/format";
import { useAuthStore } from "@/store/auth-store";

function statusStyle(status: string) {
  const key = status.toUpperCase();
  if (key === "CONFIRMED" || key === "DELIVERED" || key === "COMPLETED") {
    return { bg: "#05966920", fg: "#059669" };
  }
  if (key === "CANCELLED") {
    return { bg: "#e11d4820", fg: "#e11d48" };
  }
  return { bg: "#d9770620", fg: "#d97706" };
}

export default function OrdersScreen() {
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);

  const ordersQuery = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
    enabled: user?.role === "CUSTOMER",
  });

  if (user?.role !== "CUSTOMER") {
    return (
      <Screen scroll={false}>
        <StateView
          icon="receipt-outline"
          title="Sign in to see your orders"
          message="Your order history is saved to your account."
          actionLabel="Go to Login"
          onAction={() => router.push("/login")}
        />
      </Screen>
    );
  }

  if (ordersQuery.isPending) {
    return (
      <Screen scroll={false}>
        <Loading label="Loading your orders..." />
      </Screen>
    );
  }

  const orders = ordersQuery.data ?? [];

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Order History</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.headerSub}>
            Track your purchases and delivery details
          </ThemedText>
        </View>
        <View
          style={[styles.totalBadge, { backgroundColor: theme.primaryMuted }]}
        >
          <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>
            Orders
          </Text>
          <Text style={[styles.totalValue, { color: theme.primary }]}>
            {orders.length}
          </Text>
        </View>
      </View>

      {ordersQuery.isError ? (
        <StateView
          icon="alert-circle"
          title="We couldn't load your orders"
          message="Check your connection and try again."
          actionLabel="Try again"
          onAction={() => ordersQuery.refetch()}
        />
      ) : orders.length === 0 ? (
        <StateView
          icon="cube-outline"
          title="No orders yet"
          message="Once you place an order, its status and delivery info will show up here."
          actionLabel="Explore products"
          onAction={() => router.push("/products")}
        />
      ) : (
        <View style={styles.list}>
          {orders.map((order) => {
            const status = statusStyle(order.status);
            return (
              <Card key={order.id} style={styles.orderCard}>
                <View style={styles.orderTopRow}>
                  <View
                    style={[styles.statusBadge, { backgroundColor: status.bg }]}
                  >
                    <View
                      style={[styles.statusDot, { backgroundColor: status.fg }]}
                    />
                    <Text style={[styles.statusText, { color: status.fg }]}>
                      {order.status}
                    </Text>
                  </View>
                  <Text
                    style={[styles.orderNumber, { color: theme.textSecondary }]}
                  >
                    #{order.orderNumber.slice(0, 7)}
                  </Text>
                </View>

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text
                      style={[styles.metaText, { color: theme.textSecondary }]}
                    >
                      {formatDate(order.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={theme.textSecondary}
                    />
                    <Text
                      numberOfLines={1}
                      style={[styles.metaText, { color: theme.textSecondary }]}
                    >
                      {order.shippingAddress}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[styles.recipient, { color: theme.textSecondary }]}
                >
                  Recipient:{" "}
                  <Text style={{ color: theme.text, fontWeight: "700" }}>
                    {order.shippingName}
                  </Text>{" "}
                  · {order.shippingPhone}
                </Text>

                <View
                  style={[styles.divider, { backgroundColor: theme.border }]}
                />

                <View style={styles.itemsHeader}>
                  <Ionicons
                    name="cart-outline"
                    size={15}
                    color={theme.primary}
                  />
                  <Text style={[styles.itemsTitle, { color: theme.text }]}>
                    Items in this order
                  </Text>
                  <Text
                    style={[styles.itemsCount, { color: theme.textSecondary }]}
                  >
                    ({order.items.length})
                  </Text>
                </View>

                <View style={styles.itemsList}>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.itemRow}>
                      <View style={styles.itemInfo}>
                        <Text
                          numberOfLines={1}
                          style={[styles.itemName, { color: theme.text }]}
                        >
                          {item.productName}
                        </Text>
                        <Text
                          style={[
                            styles.itemMeta,
                            { color: theme.textSecondary },
                          ]}
                        >
                          {item.unitPrice} ks · Qty {item.quantity}
                        </Text>
                      </View>
                      <Text
                        style={[styles.itemSubtotal, { color: theme.text }]}
                      >
                        {item.subtotal} Ks
                      </Text>
                    </View>
                  ))}
                </View>

                <View
                  style={[
                    styles.orderTotalRow,
                    { borderTopColor: theme.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.orderTotalLabel,
                      { color: theme.textSecondary },
                    ]}
                  >
                    Order total
                  </Text>
                  <Text style={[styles.orderTotalValue, { color: theme.text }]}>
                    {order.totalAmount} Ks
                  </Text>
                </View>

                <Button
                  title="Continue shopping"
                  variant="ghost"
                  size="sm"
                  icon="arrow-forward"
                  onPress={() => router.push("/products")}
                />
              </Card>
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: Spacing.three,
  },
  headerSub: {
    marginTop: 2,
    maxWidth: 260,
  },
  totalBadge: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  list: {
    gap: Spacing.three,
  },
  orderCard: {
    gap: Spacing.two,
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.three,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.three,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    maxWidth: "100%",
  },
  metaText: {
    fontSize: 13,
    maxWidth: 220,
  },
  recipient: {
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    height: 1,
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  itemsCount: {
    fontSize: 14,
  },
  itemsList: {
    gap: Spacing.two,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
  },
  itemMeta: {
    fontSize: 12,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: "700",
  },
  orderTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: Spacing.two,
  },
  orderTotalLabel: {
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    fontWeight: "600",
  },
  orderTotalValue: {
    fontSize: 18,
    fontWeight: "800",
  },
});
