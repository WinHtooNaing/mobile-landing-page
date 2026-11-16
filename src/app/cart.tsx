import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  createOrder,
  submitManualPayment,
  type CreateOrderResponse,
} from '@/api/orders';
import {
  deleteAddToCart,
  deleteAddToCartById,
  getAddToCartItems,
  updateQuantity,
} from '@/api/cart';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Input } from '@/components/input';
import { Screen } from '@/components/screen';
import { Loading, StateView } from '@/components/state-view';
import { ThemedText } from '@/components/themed-text';
import { PAYMENT_PROVIDERS, type PaymentProviderCode } from '@/config';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatPrice } from '@/lib/format';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/auth-store';

class ManualPaymentSubmissionError extends Error {
  orderId: string;

  constructor(orderId: string, message: string) {
    super(message);
    this.orderId = orderId;
  }
}

export default function CartScreen() {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');
  const [providerCode, setProviderCode] = useState<PaymentProviderCode>('KBZ_PAY');
  const [transactionReference, setTransactionReference] = useState('');
  const [paymentImage, setPaymentImage] = useState<ImagePicker.ImagePickerAsset | null>(
    null
  );
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);

  const cartQuery = useQuery({
    queryKey: ['cart'],
    queryFn: getAddToCartItems,
    enabled: user?.role === 'CUSTOMER',
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  const clearAll = useMutation({
    mutationFn: deleteAddToCart,
    onSuccess: (res) => {
      if (res.success) toast.success('Cart cleared');
      invalidate();
    },
    onError: () => toast.error('Could not clear the cart.'),
  });

  const removeById = useMutation({
    mutationFn: (id: string) => deleteAddToCartById(id),
    onSuccess: () => invalidate(),
    onError: () => toast.error('Could not remove the item.'),
  });

  const changeQty = useMutation({
    mutationFn: (payload: { productId: string; quantity: number }) =>
      updateQuantity(payload),
    onSuccess: invalidate,
    onError: () => toast.error('Could not update quantity.'),
  });

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      toast.error('We need photo access to attach your payment screenshot.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPaymentImage(result.assets[0]);
    }
  };

  const checkout = useMutation({
    mutationFn: async () => {
      const items = (cartQuery.data?.items ?? []).map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      if (items.length === 0) {
        throw new Error('Your cart is empty.');
      }
      if (!paymentImage) {
        throw new Error('Please attach your payment screenshot.');
      }
      if (!transactionReference.trim()) {
        throw new Error('Please enter the transaction reference.');
      }

      let orderId = pendingOrderId ?? undefined;

      if (!orderId) {
        const created: CreateOrderResponse = await createOrder({
          paymentMethod: 'MANUAL',
          shippingName: shippingName.trim(),
          shippingPhone: shippingPhone.trim(),
          shippingAddress: shippingAddress.trim(),
          note: note.trim(),
          items,
        });
        if (created.success === false) {
          throw new Error(created.message ?? 'Could not create the order.');
        }
        orderId = created.orderId ?? created.data?.orderId ?? created.data?.id;
        if (!orderId) {
          throw new Error('The order response did not include an order ID.');
        }
      }

      try {
        const paymentResponse = await submitManualPayment(orderId, {
          providerCode,
          transactionReference: transactionReference.trim(),
          image: {
            uri: paymentImage.uri,
            name: paymentImage.fileName ?? 'payment.jpg',
            type: paymentImage.mimeType ?? 'image/jpeg',
          },
        });
        if (paymentResponse.success === false) {
          throw new Error(paymentResponse.message ?? 'Could not submit the payment.');
        }
      } catch (error) {
        throw new ManualPaymentSubmissionError(
          orderId,
          error instanceof Error ? error.message : 'Payment submission failed.'
        );
      }

      try {
        const cleared = await deleteAddToCart();
        if (!cleared.success) {
          toast.info('Order placed, but please clear your cart manually.');
        }
      } catch {
        toast.info('Order placed, but please clear your cart manually.');
      }

      return orderId;
    },
    onSuccess: () => {
      toast.success('Order placed successfully!');
      setPendingOrderId(null);
      setCheckoutOpen(false);
      resetForm();
      invalidate();
      router.push('/orders');
    },
    onError: (error: unknown) => {
      if (error instanceof ManualPaymentSubmissionError) {
        setPendingOrderId(error.orderId);
      }
      toast.error(error instanceof Error ? error.message : 'Something went wrong.');
    },
  });

  const resetForm = () => {
    setShippingName('');
    setShippingPhone('');
    setShippingAddress('');
    setNote('');
    setProviderCode('KBZ_PAY');
    setTransactionReference('');
    setPaymentImage(null);
  };

  if (user?.role !== 'CUSTOMER') {
    return (
      <Screen scroll={false}>
        <StateView
          icon="cart-outline"
          title="Sign in to view your cart"
          message="Your cart is saved to your account. Sign in to continue shopping."
          actionLabel="Go to Login"
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  if (cartQuery.isPending) {
    return (
      <Screen scroll={false}>
        <Loading label="Loading your cart..." />
      </Screen>
    );
  }

  const items = cartQuery.data?.items ?? [];
  const subtotal = cartQuery.data?.subtotal ?? 0;

  if (items.length === 0) {
    return (
      <Screen scroll={false}>
        <StateView
          icon="bag-handle-outline"
          title="Your cart is empty"
          message="Looks like you haven't added anything to your cart yet."
          actionLabel="Continue shopping"
          onAction={() => router.push('/products')}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View>
          <ThemedText type="subtitle">Your Cart</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.headerSub}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </ThemedText>
        </View>
        <Button
          title="Clear"
          variant="danger"
          size="sm"
          icon="trash-outline"
          loading={clearAll.isPending}
          onPress={() => clearAll.mutate()}
        />
      </View>

      <View style={styles.list}>
        {items.map((item) => (
          <Card key={item.productId} padded={false} style={styles.itemCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/products/[id]',
                  params: { id: item.productId },
                })
              }
              style={styles.itemImageWrap}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                contentFit="cover"
                transition={150}
              />
            </Pressable>

            <View style={styles.itemBody}>
              <View style={styles.itemTopRow}>
                <View style={styles.itemTitleWrap}>
                  <Text numberOfLines={1} style={[styles.itemName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.itemPrice, { color: theme.primary }]}>
                    {formatPrice(item.currentUnitPrice)}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name}`}
                  onPress={() => removeById.mutate(item.productId)}
                  style={[styles.removeBtn, { backgroundColor: theme.primaryMuted }]}
                >
                  <Ionicons name="trash-outline" size={18} color={theme.danger} />
                </Pressable>
              </View>

              <View style={styles.qtyRow}>
                <Text style={[styles.lineTotal, { color: theme.text }]}>
                  {formatPrice(item.currentUnitPrice * item.quantity)}
                </Text>

                <View style={[styles.qtyStepper, { borderColor: theme.border }]}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      changeQty.mutate({
                        productId: item.productId,
                        quantity: Math.max(1, item.quantity - 1),
                      })
                    }
                    style={styles.qtyBtn}
                  >
                    <Ionicons name="remove" size={16} color={theme.text} />
                  </Pressable>
                  <Text style={[styles.qtyValue, { color: theme.text }]}>
                    {item.quantity}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      changeQty.mutate({
                        productId: item.productId,
                        quantity: item.quantity + 1,
                      })
                    }
                    style={styles.qtyBtn}
                  >
                    <Ionicons name="add" size={16} color={theme.text} />
                  </Pressable>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </View>

      <Card style={styles.summary}>
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
        <SummaryRow label="Delivery" value="Free" valueColor={theme.success} />
        <SummaryRow label="Tax" value="Included" />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <SummaryRow label="Total" value={formatPrice(subtotal)} bold />

        <Button
          title={checkoutOpen ? 'Hide checkout form' : 'Proceed to Checkout'}
          size="lg"
          fullWidth
          icon="shield-checkmark-outline"
          style={styles.checkoutBtn}
          onPress={() => setCheckoutOpen((open) => !open)}
        />
      </Card>

      {checkoutOpen ? (
        <Card style={styles.checkoutCard}>
          <ThemedText type="subtitle">Checkout</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.checkoutSub}>
            Complete your details to place your order.
          </ThemedText>

          {pendingOrderId ? (
            <View style={[styles.notice, { backgroundColor: theme.warning + '20' }]}>
              <Text style={[styles.noticeText, { color: theme.warning }]}>
                Order {pendingOrderId} already exists. Submitting again will retry
                its payment, not create another order.
              </Text>
            </View>
          ) : null}

          <Input
            label="Your name"
            leftIcon="person-outline"
            placeholder="Your full name"
            value={shippingName}
            onChangeText={setShippingName}
          />
          <Input
            label="Phone number"
            leftIcon="call-outline"
            placeholder="09 123 456 789"
            keyboardType="phone-pad"
            value={shippingPhone}
            onChangeText={setShippingPhone}
          />
          <Input
            label="Delivery address"
            leftIcon="location-outline"
            placeholder="No. 12, Main Street, Yangon"
            multiline
            value={shippingAddress}
            onChangeText={setShippingAddress}
          />
          <Input
            label="Order note (optional)"
            leftIcon="document-text-outline"
            placeholder="Any delivery instructions?"
            multiline
            value={note}
            onChangeText={setNote}
          />

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>
              Choose how to pay
            </Text>
            <View style={styles.providerRow}>
              {PAYMENT_PROVIDERS.map((provider) => {
                const selected = providerCode === provider.code;
                return (
                  <Pressable
                    key={provider.code}
                    accessibilityRole="button"
                    onPress={() => setProviderCode(provider.code)}
                    style={[
                      styles.providerCard,
                      {
                        backgroundColor: selected ? theme.primaryMuted : theme.card,
                        borderColor: selected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <View
                      style={[styles.providerMark, { backgroundColor: provider.colors }]}
                    >
                      <Text style={styles.providerMarkText}>{provider.mark}</Text>
                    </View>
                    <View style={styles.providerInfo}>
                      <Text style={[styles.providerName, { color: theme.text }]}>
                        {provider.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={[styles.providerDetail, { color: theme.textSecondary }]}
                      >
                        {provider.detail}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.radio,
                        {
                          borderColor: selected ? theme.primary : theme.border,
                          backgroundColor: selected ? theme.primary : 'transparent',
                        },
                      ]}
                    >
                      {selected ? (
                        <Ionicons
                          name="checkmark"
                          size={12}
                          color={theme.primaryForeground}
                        />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={[styles.qrBox, { backgroundColor: theme.cardMuted }]}>
            <Ionicons name="qr-code-outline" size={36} color={theme.primary} />
            <View style={styles.qrInfo}>
              <Text style={[styles.qrTitle, { color: theme.text }]}>
                Scan to pay with {providerCode === 'KBZ_PAY' ? 'KBZ Pay' : 'Wave Pay'}
              </Text>
              <Text style={[styles.qrDetail, { color: theme.textSecondary }]}>
                Scan the QR, then enter the transaction reference and attach your
                payment screenshot below.
              </Text>
              <Text style={[styles.demoBadge, { color: theme.danger }]}>DEMO QR</Text>
            </View>
          </View>

          <Input
            label="Transaction reference"
            leftIcon="receipt-outline"
            placeholder="Enter your transaction reference"
            value={transactionReference}
            onChangeText={setTransactionReference}
          />

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: theme.text }]}>
              Payment screenshot
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={pickImage}
              style={[
                styles.imagePicker,
                { borderColor: paymentImage ? theme.primary : theme.border },
              ]}
            >
              {paymentImage ? (
                <Image source={{ uri: paymentImage.uri }} style={styles.pickPreview} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={28} color={theme.textSecondary} />
                  <Text style={[styles.pickText, { color: theme.textSecondary }]}>
                    Tap to choose a screenshot
                  </Text>
                </>
              )}
            </Pressable>
          </View>

          <Button
            title={checkout.isPending ? 'Submitting...' : 'Confirm Order'}
            size="lg"
            fullWidth
            icon="shield-checkmark-outline"
            loading={checkout.isPending}
            onPress={() => checkout.mutate()}
          />
          <Button
            title="Cancel"
            variant="outline"
            size="md"
            fullWidth
            onPress={() => setCheckoutOpen(false)}
          />
        </Card>
      ) : null}

      <Button
        title="Continue Shopping"
        variant="ghost"
        size="md"
        icon="arrow-back"
        onPress={() => router.push('/products')}
      />
    </Screen>
  );
}

function SummaryRow({
  label,
  value,
  valueColor,
  bold,
}: {
  label: string;
  value: string;
  valueColor?: string;
  bold?: boolean;
}) {
  const theme = useTheme();
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text
        style={[
          styles.summaryValue,
          { color: valueColor ?? theme.text },
          bold && styles.summaryValueBold,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: Spacing.three,
  },
  headerSub: {
    marginTop: 2,
  },
  list: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  itemCard: {
    flexDirection: 'row',
    padding: Spacing.two,
    gap: Spacing.three,
  },
  itemImageWrap: {
    width: 92,
    height: 92,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: '#f1f5f9',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemTitleWrap: {
    flex: 1,
    paddingRight: Spacing.two,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
  },
  itemPrice: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '700',
  },
  removeBtn: {
    height: 34,
    width: 34,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lineTotal: {
    fontSize: 16,
    fontWeight: '800',
  },
  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  qtyBtn: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 24,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
  },
  summary: {
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryValueBold: {
    fontSize: 18,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.one,
  },
  checkoutBtn: {
    marginTop: Spacing.two,
  },
  checkoutCard: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },
  checkoutSub: {
    marginTop: -Spacing.one,
    marginBottom: Spacing.two,
  },
  notice: {
    padding: Spacing.three,
    borderRadius: Radius.md,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 18,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  providerRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  providerCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    gap: Spacing.two,
  },
  providerMark: {
    height: 40,
    width: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerMarkText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '700',
  },
  providerDetail: {
    fontSize: 11,
  },
  radio: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrBox: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  qrInfo: {
    flex: 1,
    gap: 2,
  },
  qrTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  qrDetail: {
    fontSize: 12,
    lineHeight: 17,
  },
  demoBadge: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 2,
  },
  imagePicker: {
    minHeight: 140,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    overflow: 'hidden',
  },
  pickText: {
    fontSize: 13,
  },
  pickPreview: {
    width: '100%',
    height: 160,
  },
});