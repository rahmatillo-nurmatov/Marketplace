import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  doc,
  getDoc,
  writeBatch,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Order } from '@/types';

const COLLECTION_NAME = 'orders';

// Statuses the client is allowed to hide from their history
const DELETABLE_STATUSES: Order['status'][] = ['delivered', 'cancelled'];

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
    const docs = querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Order & { hiddenForClient?: boolean }));

    // Filter out orders the client has hidden
    return docs
      .filter(o => !o.hiddenForClient)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getOrderById(id: string): Promise<Order | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() } as Order;
    return null;
  },

  async getAllOrders(): Promise<Order[]> {
    // Seller/admin sees ALL orders regardless of hiddenForClient
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Order));
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status, updatedAt: Date.now() });
  },

  async checkIfUserBoughtProduct(clientId: string, productId: string): Promise<boolean> {
    const orders = await this.getOrdersByClient(clientId);
    return orders.some(order => order.items.some(item => item.productId === productId));
  },

  // Hides order from client history without deleting from Firestore
  async hideOrderForClient(id: string, status: Order['status']): Promise<void> {
    if (!DELETABLE_STATUSES.includes(status)) {
      throw new Error(`Cannot delete order with status "${status}"`);
    }
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { hiddenForClient: true, updatedAt: Date.now() });
  },

  // Hides all delivered/cancelled orders for a client
  async hideAllDeletableForClient(clientId: string): Promise<void> {
    const q = query(collection(db, COLLECTION_NAME), where('clientId', '==', clientId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach(d => {
      const status = d.data().status as Order['status'];
      if (DELETABLE_STATUSES.includes(status) && !d.data().hiddenForClient) {
        batch.update(d.ref, { hiddenForClient: true, updatedAt: Date.now() });
      }
    });
    await batch.commit();
  },

  isDeletable(status: Order['status']): boolean {
    return DELETABLE_STATUSES.includes(status);
  }
};
