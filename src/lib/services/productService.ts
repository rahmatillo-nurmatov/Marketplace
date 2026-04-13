import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const COLLECTION_NAME = 'products';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const dbProducts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
    
    // Combine real DB products with mock baseline items
    return [...dbProducts, ...MOCK_PRODUCTS];
  },

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  async getSellerProducts(sellerId: string): Promise<Product[]> {
    const q = query(collection(db, COLLECTION_NAME), where('sellerId', '==', sellerId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  },

  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return docRef.id;
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...productData,
      updatedAt: Date.now()
    });
  },

  async deleteProduct(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  async seedProducts(sellerId: string): Promise<void> {
    const mocks = [
      { name: 'Gaming Laptop', description: 'High performance gaming laptop with RGB keyboard.', price: 1200, cost: 800, stock: 10, categoryId: 'electronics', images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'] },
      { name: 'Wireless Headphones', description: 'Noise cancelling overhead headphones.', price: 199, cost: 120, stock: 50, categoryId: 'electronics', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'] },
      { name: 'Cotton T-Shirt', description: 'Premium 100% cotton t-shirt in Navy Blue.', price: 25, cost: 10, stock: 100, categoryId: 'fashion', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'] },
      { name: 'Red Sneakers', description: 'Comfortable sports sneakers for everyday use.', price: 85, cost: 40, stock: 30, categoryId: 'fashion', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
      { name: 'Coffee Mug', description: 'Ceramic mug with a minimalist design.', price: 15, cost: 5, stock: 200, categoryId: 'home', images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'] },
      { name: 'Mechanical Keyboard', description: 'Tactile mechanical keyboard for programmers.', price: 120, cost: 70, stock: 15, categoryId: 'electronics', images: ['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800'] },
    ];

    for (const mock of mocks) {
      await this.addProduct({
        ...mock,
        sellerId
      });
    }
  },

  async getSellerOrders(sellerId: string): Promise<any[]> {
    // In a real app, this would query an 'orders' collection filtering by sellerId in items
    // For MVP, we'll return an empty array or mock data
    return [];
  }
};
