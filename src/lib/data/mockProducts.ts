import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'mock-1',
    name: 'Apple iPhone 15 Pro',
    description: 'The ultimate iPhone with Titanium design, A17 Pro chip, and a 48MP Pro camera system. Stunning 6.1-inch Super Retina XDR display.',
    price: 999.00,
    cost: 750.00,
    stock: 25,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-2',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with two processors, eight microphones, and exceptional sound quality.',
    price: 349.99,
    cost: 180.00,
    stock: 50,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1695653422715-991ec3a0db7a?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-3',
    name: 'Nike Air Jordan 1 Retro High',
    description: 'Iconic high-top sneakers in the classic Chicago Bulls colors. Premium leather upper and encapsulated Air-Sole unit.',
    price: 180.00,
    cost: 65.00,
    stock: 12,
    categoryId: 'fashion',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-4',
    name: 'Herman Miller Aeron Chair',
    description: 'The gold standard of ergonomic office chairs. Designed to provide lumbar support and Breathable Pellicle suspension.',
    price: 1600.00,
    cost: 900.00,
    stock: 8,
    categoryId: 'home',
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-5',
    name: 'Razer Huntsman V3 Pro',
    description: 'Analog Optical Gaming Keyboard with rapid trigger and adjustable actuation. Premium aluminum construction.',
    price: 249.99,
    cost: 140.00,
    stock: 30,
    categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1618384881928-1589f29ee2ad?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-6',
    name: 'Dyson V15 Detect',
    description: 'Powerful and intelligent vacuum cleaner with hair screw tool and laser dust detection technology.',
    price: 749.00,
    cost: 450.00,
    stock: 15,
    categoryId: 'home',
    images: ['https://images.unsplash.com/photo-1558317374-067df5f15430?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-7',
    name: 'Stanley Quencher H2.0',
    description: 'The viral 40oz Tumbler with handle and straw. Keeps drinks cold for up to 48 hours.',
    price: 45.00,
    cost: 12.00,
    stock: 100,
    categoryId: 'home',
    images: ['https://images.unsplash.com/photo-1695653422543-9da9c7f6685a?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'mock-8',
    name: 'Zara oversized Blazer',
    description: 'Elegant oversized double-breasted blazer with peaked lapels and long sleeves. Perfect for professional or casual outfits.',
    price: 129.00,
    cost: 40.00,
    stock: 40,
    categoryId: 'fashion',
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
    sellerId: 'system',
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];
