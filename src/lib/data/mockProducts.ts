import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  // --- ELECTRONICS (8 items) ---
  {
    id: 'mock-e1',
    name: 'iPhone 15 Pro',
    description: 'Latest flagship with Titanium design and A17 Pro chip.',
    price: 999.00, cost: 700.00, stock: 15, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d256e?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e2',
    name: 'Sony WH-1000XM5',
    description: 'Premium noise-canceling wireless headphones.',
    price: 349.00, cost: 200.00, stock: 20, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e3',
    name: 'MacBook Air M3',
    description: 'Ultra-thin laptop with the powerful M3 chip.',
    price: 1099.00, cost: 800.00, stock: 10, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1517336714460-4c50fd410f44?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e4',
    name: 'iPad Pro 12.9',
    description: 'Powerful tablet with Liquid Retina XDR display.',
    price: 1099.00, cost: 750.00, stock: 12, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e5',
    name: 'Samsung S24 Ultra',
    description: 'The ultimate Android smartphone with AI features.',
    price: 1199.00, cost: 850.00, stock: 14, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1610945265064-0630ea51145a?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e6',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard for gaming.',
    price: 120.00, cost: 60.00, stock: 40, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e7',
    name: 'Logitech MX Master 3S',
    description: 'The most advanced ergonomic office mouse.',
    price: 99.00, cost: 50.00, stock: 35, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e8',
    name: 'Sony PlayStation 5',
    description: 'Next-gen gaming console with ultra-fast SSD.',
    price: 499.00, cost: 400.00, stock: 8, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },

  // --- CLOTHES (8 items) ---
  {
    id: 'mock-c1',
    name: 'Jordan 1 Retro',
    description: 'Classic high-top sneakers in iconic colors.',
    price: 180.00, cost: 80.00, stock: 10, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c2',
    name: 'Oversized Hoodie',
    description: 'Cozy and stylish oversized cotton hoodie.',
    price: 65.00, cost: 25.00, stock: 50, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c3',
    name: 'Denim Jacket',
    description: 'Classic blue denim jacket with vintage wash.',
    price: 89.00, cost: 40.00, stock: 25, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d890e49?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c4',
    name: 'Carhartt Beanie',
    description: 'Warm and durable acrylic watch hat.',
    price: 25.00, cost: 8.00, stock: 100, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c5',
    name: 'Leather Boots',
    description: 'Handcrafted genuine leather boots for all seasons.',
    price: 220.00, cost: 110.00, stock: 15, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c6',
    name: 'Linen Shirt',
    description: 'Breathable linen shirt for hot summer days.',
    price: 45.00, cost: 20.00, stock: 40, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c7',
    name: 'Wool Scarf',
    description: 'Soft merino wool scarf for winter warmth.',
    price: 35.00, cost: 15.00, stock: 60, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c8',
    name: 'Aviator Sunglasses',
    description: 'Classic gold-frame aviators with polarized lenses.',
    price: 150.00, cost: 70.00, stock: 30, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },

  // --- FURNITURE (8 items) ---
  {
    id: 'mock-f1',
    name: 'Ergonomic Chair',
    description: 'Premium office chair for maximum comfort.',
    price: 450.00, cost: 250.00, stock: 10, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f2',
    name: 'Velvet Sofa',
    description: 'Modern 3-seater sofa in deep emerald velvet.',
    price: 899.00, cost: 500.00, stock: 5, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f3',
    name: 'Oak Dining Table',
    description: 'Solid oak dining table for family gatherings.',
    price: 1200.00, cost: 700.00, stock: 4, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f4',
    name: 'Minimalist Desk',
    description: 'Clean and simple desk for your home office.',
    price: 199.00, cost: 90.00, stock: 20, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f5',
    name: 'Floor Lamp',
    description: 'Modern floor lamp with adjustable brightness.',
    price: 75.00, cost: 30.00, stock: 30, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed047c992d?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f6',
    name: 'Bookshelf',
    description: 'Tall wooden bookshelf with 5 spacious levels.',
    price: 150.00, cost: 70.00, stock: 15, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f7',
    name: 'Armchair',
    description: 'Classic cozy armchair for reading and relaxation.',
    price: 350.00, cost: 180.00, stock: 8, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1598191383446-462f99ef33a8?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f8',
    name: 'Bed Frame',
    description: 'Queen-size bed frame with upholstered headboard.',
    price: 550.00, cost: 300.00, stock: 6, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1505693413171-293669746a57?w=800'],
    sellerId: 'system', createdAt: Date.now(), updatedAt: Date.now()
  }
];
