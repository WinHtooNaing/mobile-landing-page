import { createAddToCart } from '@/api/cart';
import { toast } from '@/lib/toast';
import { useAuthStore } from '@/store/auth-store';
import type { Product } from '@/types';
import { router } from 'expo-router';

/**
 * Adds a product to the cart. Requires a signed-in customer; otherwise the
 * user is sent to the login screen.
 */
export function useAddToCart() {
  const user = useAuthStore((state) => state.user);

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
        toast.success('Product added to cart');
      } else {
        toast.error('Could not add the product to your cart.');
      }
    } catch {
      toast.error('Something went wrong while adding to your cart.');
    }
  };
}