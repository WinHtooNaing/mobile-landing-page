export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type StockProps = {
  availableQuantity: number;
  inStock: boolean;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  stock: StockProps;
  imageUrl: string;
  isActive: boolean;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductList = {
  items: Product[];
  pagination: Pagination;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  imagePublicId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  isActive: boolean;
  quantity: number;
  currentUnitPrice: number;
  lineSubtotal: number;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
};

export type CartCreatePayload = {
  productId: string;
  quantity: number;
};

export type CreateOrderPayload = {
  paymentMethod: 'MANUAL';
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  note: string;
  items: {
    productId: string;
    quantity: number;
  }[];
};

export type ManualPaymentPayload = {
  providerCode: 'KBZ_PAY' | 'WAVE_MONEY';
  transactionReference: string;
  image: { uri: string; name: string; type: string };
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  createdAt: string;
  items: OrderItem[];
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  data: {
    accessToken?: string;
    refreshToken?: string;
    user?: User;
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    role?: string;
  };
};