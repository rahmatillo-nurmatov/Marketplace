export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  stock: number;
  categoryId: string;
  images: string[];
  sellerId: string;
  createdAt: number;
  updatedAt: number;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  clientId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  productId: string;
  clientId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: number;
}
