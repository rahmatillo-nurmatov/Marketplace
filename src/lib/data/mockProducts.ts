import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: 'iPhone 15',
    description: 'Latest model with 48MP camera and advanced features.',
    price: 799.00,
    cost: 500.00,
    stock: 25,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1592750475338-74575a4958fc?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-2',
    name: 'Sony Headphones',
    description: 'High-quality noise-canceling wireless headphones.',
    price: 199.99,
    cost: 100.00,
    stock: 50,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-3',
    name: 'Red Sneakers',
    description: 'Casual comfortable red sneakers for everyday wear.',
    price: 55.00,
    cost: 25.00,
    stock: 12,
    categoryId: 'fashion',
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-4',
    name: 'Office Chair',
    description: 'Comfortable ergonomic chair for long working hours.',
    price: 149.00,
    cost: 80.00,
    stock: 8,
    categoryId: 'home',
    images: ['https://images.unsplash.com/photo-1505797149-43c0ad43f994?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-5',
    name: 'Mechanical Keyboard',
    description: 'Full RGB backlit mechanical gaming keyboard.',
    price: 99.99,
    cost: 45.00,
    stock: 30,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1618384881928-1589f29ee2ad?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-6',
    name: 'Smart Watch',
    description: 'Modern smartwatch with health tracking and GPS.',
    price: 129.00,
    cost: 60.00,
    stock: 15,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1508685096489-77a46807f0f8?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
