import { Product } from '@/types';

export const MOCK_PRODUCTS: Product[] = [
  // --- ELECTRONICS (8 items) ---
  {
    id: 'mock-e1',
    name: 'iPhone 15 Pro',
    description: 'Experience the pinnacle of mobile technology with the iPhone 15 Pro. Featuring a stunning Titanium design, the powerful A17 Pro chip for next-level gaming performance, and a versatile 48MP Pro camera system that captures breathtaking detail.',
    price: 999.00, cost: 700.00, stock: 15, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e2',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation meets exceptional sound quality. These headphones feature two processors that control eight microphones for unprecedented noise reduction and crystal-clear hands-free calling.',
    price: 349.00, cost: 200.00, stock: 20, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e3',
    name: 'MacBook Air M3',
    description: 'The world’s most popular laptop is better than ever. The M3 chip brings even greater capabilities to the super-portable MacBook Air. With up to 18 hours of battery life, you can take it anywhere and blaze through any task.',
    price: 1099.00, cost: 800.00, stock: 10, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1517336714460-4c50fd410f44?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e4',
    name: 'iPad Pro 12.9',
    description: 'The ultimate iPad experience. Now with breakthrough M2 performance, a mind-blowing Liquid Retina XDR display, and superfast wireless connectivity. It is the perfect tool for creators and professionals on the go.',
    price: 899.00, cost: 650.00, stock: 12, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e5',
    name: 'Samsung S24 Ultra',
    description: 'Welcome to the era of mobile AI. With S24 Ultra, you can unleash whole new levels of creativity, productivity, and possibility. Featuring a built-in S Pen and a massive 200MP camera for professional-grade photography.',
    price: 1199.00, cost: 850.00, stock: 14, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1610945265064-0630ea51145a?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e6',
    name: 'Mechanical Keyboard',
    description: 'Elevate your gaming and typing experience. This premium mechanical keyboard features tactile brown switches, full RGB per-key backlighting, and a durable aluminum top plate for long-lasting stability.',
    price: 120.00, cost: 60.00, stock: 40, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e7',
    name: 'Logitech MX Master 3S',
    description: 'An icon, remastered. Meet MX Master 3S – an iconic mouse remastered. Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8K DPI track-on-glass sensor.',
    price: 99.00, cost: 50.00, stock: 35, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-e8',
    name: 'Sony PlayStation 5',
    description: 'Play Has No Limits. Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.',
    price: 499.00, cost: 400.00, stock: 8, categoryId: 'electronics',
    images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },

  // --- CLOTHES (8 items) ---
  {
    id: 'mock-c1',
    name: 'Jordan 1 Retro',
    description: 'The sneaker that started it all. The Air Jordan 1 Retro provides classic style with premium leather and an encapsulated Air-Sole unit for lightweight cushioning. A must-have for every sneakerhead collection.',
    price: 180.00, cost: 80.00, stock: 10, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c2',
    name: 'Oversized Hoodie',
    description: 'Wrap yourself in ultimate comfort. Crafted from heavy-weight premium cotton, this oversized hoodie features a soft brushed interior and a relaxed fit that is perfect for lounge days or street-style looks.',
    price: 45.00, cost: 15.00, stock: 50, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c3',
    name: 'Denim Jacket',
    description: 'A timeless staple for any wardrobe. This classic blue denim jacket features a vintage wash, silver-toned hardware, and a durable construction that only gets better with age. Versatile for any season.',
    price: 65.00, cost: 30.00, stock: 25, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1576871337622-98d48d890e49?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c4',
    name: 'Carhartt Beanie',
    description: 'Stay warm on the coldest days. The iconic Carhartt watch hat is made of soft, stretchable acrylic rib-knit that keeps your head cozy while providing a rugged, work-wear inspired look.',
    price: 19.99, cost: 7.00, stock: 100, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c5',
    name: 'Leather Boots',
    description: 'Rugged durability meets refined style. These handcrafted boots are made from genuine top-grain leather and feature a Goodyear welt construction for superior longevity and weather resistance.',
    price: 180.00, cost: 90.00, stock: 15, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1520639889313-72702c189e76?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c6',
    name: 'Linen Shirt',
    description: 'Stay cool and sophisticated. Our 100% premium linen shirt is designed for optimal breathability in warm climates. Featuring a tailored fit and a classic button-down collar for a polished look.',
    price: 49.00, cost: 20.00, stock: 40, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c7',
    name: 'Wool Scarf',
    description: 'Luxury you can feel. This ultra-soft scarf is knitted from high-quality merino wool, offering exceptional warmth without the bulk. A sophisticated accessory for any winter coat or jacket.',
    price: 35.00, cost: 15.00, stock: 60, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-c8',
    name: 'Aviator Sunglasses',
    description: 'The ultimate finishing touch. These classic aviator sunglasses feature polarized lenses for crystal-clear vision and a lightweight gold-finished frame that provides all-day comfort and style.',
    price: 129.00, cost: 50.00, stock: 30, categoryId: 'clothes',
    images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },

  // --- FURNITURE (8 items) ---
  {
    id: 'mock-f1',
    name: 'Ergonomic Chair',
    description: 'Invest in your health and productivity. This ergonomic office chair features a breathable mesh back, adjustable lumbar support, and synchronized tilt technology to support your natural posture throughout the day.',
    price: 349.00, cost: 180.00, stock: 10, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1505797149-43c0ad43f994?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f2',
    name: 'Velvet Sofa',
    description: 'A centerpiece of modern luxury. This 3-seater sofa is upholstered in deep emerald green velvet with high-density foam cushions for ultimate comfort. Supported by elegant gold-finished tapered legs.',
    price: 799.00, cost: 450.00, stock: 5, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f3',
    name: 'Oak Dining Table',
    description: 'Gather around with quality. Our solid oak dining table is built to last for generations. Featuring a natural oiled finish that highlights the beautiful grain patterns and comfortably seats up to six people.',
    price: 850.00, cost: 500.00, stock: 4, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f4',
    name: 'Minimalist Desk',
    description: 'Clean design for a clear mind. This minimalist workstation features a large white desktop and slim scandinavian-style wooden legs. Practical and beautiful, it includes a hidden cable management tray.',
    price: 149.00, cost: 70.00, stock: 20, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f5',
    name: 'Floor Lamp',
    description: 'Create the perfect ambiance. This industrial-style floor lamp features a matte black finish and a warm Edison bulb that provides soft, indirect lighting – ideal for reading nooks or living rooms.',
    price: 59.00, cost: 25.00, stock: 30, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1507473885765-e6ed047c992d?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f6',
    name: 'Bookshelf',
    description: 'Organize your library with style. This tall open-shelf unit is crafted from sustainable bamboo and features five spacious levels for books, plants, and decorative items. Sturdy enough for heavy volumes.',
    price: 129.00, cost: 60.00, stock: 15, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f7',
    name: 'Armchair',
    description: 'The best seat in the house. This mid-century modern armchair features a warm walnut frame and premium gray fabric upholstery. Ergonomically reclined for maximum relaxation during long reading sessions.',
    price: 299.00, cost: 150.00, stock: 8, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1598191383446-462f99ef33a8?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  },
  {
    id: 'mock-f8',
    name: 'Bed Frame',
    description: 'Modern comfort for deep sleep. This low-profile queen-size bed frame features an upholstered headboard in neutral gray linen and a sturdy slatted base that eliminates the need for a box spring.',
    price: 450.00, cost: 250.00, stock: 6, categoryId: 'furniture',
    images: ['https://images.unsplash.com/photo-1505693413171-293669746a57?auto=format&fit=crop&q=80&w=1200'],
    sellerId: 'system', status: 'approved', createdAt: Date.now(), updatedAt: Date.now()
  }
];
