import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { CART_QUERY_KEY, createAddToCart } from '@/api/cart';
import { getApiErrorMessage } from '@/api/axios-instance';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/auth-store';
import type { Product } from '@/types';

/**
 * Adds a product to the cart. Requires a signed-in customer; otherwise the
 * user is sent to the login screen.
 */
export function useAddToCart() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  return async (product: Product, quantity = 1) => {
    if (user?.role !== 'CUSTOMER') {
      toast.info('Please sign in to add items to your cart.');
      router.push('/login');
      return;
    }

    try {
      const response = await createAddToCart({
        productId: product.id,
        quantity,
      });
      if (response.success) {
        queryClient.setQueryData(CART_QUERY_KEY, response.data);
        toast.success('Product added to cart');
      } else {
        toast.error('Could not add the product to your cart.');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Could not add the product to your cart.'));
    }
  };
}