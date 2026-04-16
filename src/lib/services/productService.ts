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

const COLLECTION_NAME = 'products';

export const productService = {
  async getProducts(): Promise<Product[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
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

  async decrementStock(productId: string, quantity: number): Promise<void> {
    const productRef = doc(db, COLLECTION_NAME, productId);

    await runTransaction(db, async (transaction) => {
      const productDoc = await transaction.get(productRef);
      if (!productDoc.exists()) throw new Error("Product does not exist!");

      const currentStock = productDoc.data().stock || 0;
      const newStock = currentStock - quantity;
      
      if (newStock < 0) {
        throw new Error(`Insufficient stock for ${productDoc.data().name}. Available: ${currentStock}`);
      }

      transaction.update(productRef, { 
        stock: newStock,
        updatedAt: Date.now()
      });
    });
  }
};
