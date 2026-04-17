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
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const COLLECTION_NAME = 'products';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const firestoreProducts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));

      return [...firestoreProducts, ...MOCK_PRODUCTS];
    } catch (err) {
      console.error("Firestore getProducts error, falling back to mock:", err);
      return MOCK_PRODUCTS;
    }
  },

  async getProductById(id: string | string[]): Promise<Product | null> {
    const actualId = Array.isArray(id) ? id[0] : id;
    if (!actualId) return null;

    // Check MOCK_PRODUCTS first for speed/testing
    const mock = MOCK_PRODUCTS.find(p => p.id === actualId);
    if (mock) return mock;

    const docRef = doc(db, COLLECTION_NAME, actualId);
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

  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...productData,
      status: 'pending',
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

  async decrementStock(productId: string, quantity: number): Promise<void> {
    // Skip stock decrement for mock items to prevent transaction errors
    if (productId.startsWith('mock-')) return;
    
    const productRef = doc(db, COLLECTION_NAME, productId);
    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) return; // Item not in DB, skip
      
      const currentStock = productDoc.data().stock || 0;
      const newStock = currentStock - quantity;
      if (newStock >= 0) {
        transaction.update(productRef, { stock: newStock, updatedAt: Date.now() });
      }
    });
  },

  async updateProductStatus(id: string, status: Product['status']): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status, updatedAt: Date.now() });
  },

  async purchasePromotion(id: string, adStartDate: number, adEndDate: number): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { 
      isPromoted: true, 
      adStartDate, 
      adEndDate,
      updatedAt: Date.now() 
    });
  },

  async getPendingProducts(): Promise<Product[]> {
    const q = query(collection(db, COLLECTION_NAME), where('status', '==', 'pending'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }
};
