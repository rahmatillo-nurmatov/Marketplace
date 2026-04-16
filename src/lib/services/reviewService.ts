import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Review } from '@/types';

const COLLECTION_NAME = 'reviews';

export const reviewService = {
  async addReview(reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...reviewData,
      createdAt: Date.now()
    });
    return docRef.id;
  },

  async getReviewsByProduct(productId: string): Promise<Review[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('productId', '==', productId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  },

  async getReviewsBySeller(sellerId: string): Promise<any[]> {
    // In a mature app, we'd denormalize or use a more complex query.
    // For now, we'll fetch all reviews and maybe filter in memory or 
    // better: fetch all products by seller first.
    const { productService } = await import('./productService');
    const sellerProducts = await productService.getSellerProducts(sellerId);
    const productIds = sellerProducts.map(p => p.id);

    if (productIds.length === 0) return [];

    // Firestore 'in' queries are limited to 10-30 IDs usually.
    // We'll just fetch all reviews and filter for simplicity in MVP.
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Review))
      .filter(r => productIds.includes(r.productId));
  }
};
