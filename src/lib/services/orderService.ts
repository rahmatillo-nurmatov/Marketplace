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
import { Order } from '@/types';

const COLLECTION_NAME = 'orders';

// Recursively remove undefined values — Firestore rejects them
function stripUndefined<T>(obj: T): T {
  if (Array.isArray(obj)) return obj.map(stripUndefined) as unknown as T;
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => [k, stripUndefined(v)])
    ) as T;
  }
  return obj;
}

export const orderService = {
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const clean = stripUndefined({
      ...orderData,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    const docRef = await addDoc(collection(db, COLLECTION_NAME), clean);
    return docRef.id;
  },

  async getOrdersByClient(clientId: string): Promise<Order[]> {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('clientId', '==', clientId)
    );
    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
    
    return docs.sort((a, b) => b.createdAt - a.createdAt);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  },

  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Order));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const { updateDoc } = await import('firebase/firestore');
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status, updatedAt: Date.now() });
  },

  async checkIfUserBoughtProduct(clientId: string, productId: string): Promise<boolean> {
    const orders = await this.getOrdersByClient(clientId);
    return orders.some(order => order.items.some(item => item.productId === productId));
  }
};
