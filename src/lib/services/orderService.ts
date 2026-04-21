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

// ── localStorage helpers for hidden order IDs ─────────────────────────────
function lsHiddenKey(clientId: string) { return `hidden_orders_${clientId}`; }

function getLocalHiddenIds(clientId: string): Set<string> {
  try {
    const raw = localStorage.getItem(lsHiddenKey(clientId));
    return new Set(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}

function addLocalHiddenId(clientId: string, orderId: string) {
  try {
    const ids = getLocalHiddenIds(clientId);
    ids.add(orderId);
    localStorage.setItem(lsHiddenKey(clientId), JSON.stringify([...ids]));
  } catch {}
}

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

    // Get locally hidden IDs as fallback (in case Firestore write failed)
    const localHidden = getLocalHiddenIds(clientId);

    // Filter out orders hidden either in Firestore or locally
    return docs
      .filter(o => !o.hiddenForClient && !localHidden.has(o.id))
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
  async hideOrderForClient(id: string, status: Order['status'], clientId?: string): Promise<void> {
    if (!DELETABLE_STATUSES.includes(status)) {
      throw new Error(`Cannot delete order with status "${status}"`);
    }
    // Save to localStorage immediately (instant, no network)
    if (clientId) addLocalHiddenId(clientId, id);

    // Also persist to Firestore (best-effort)
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, { hiddenForClient: true, updatedAt: Date.now() });
    } catch (e) {
      console.warn('Firestore hide failed, using local cache only:', e);
    }
  },

  // Hides all delivered/cancelled orders for a client
  async hideAllDeletableForClient(clientId: string): Promise<void> {
    const q = query(collection(db, COLLECTION_NAME), where('clientId', '==', clientId));
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    const idsToHide: string[] = [];

    snap.docs.forEach(d => {
      const status = d.data().status as Order['status'];
      if (DELETABLE_STATUSES.includes(status) && !d.data().hiddenForClient) {
        batch.update(d.ref, { hiddenForClient: true, updatedAt: Date.now() });
        idsToHide.push(d.id);
      }
    });

    // Save to localStorage immediately
    idsToHide.forEach(id => addLocalHiddenId(clientId, id));

    try {
      await batch.commit();
    } catch (e) {
      console.warn('Firestore batch hide failed, using local cache only:', e);
    }
  },

  isDeletable(status: Order['status']): boolean {
    return DELETABLE_STATUSES.includes(status);
  }
};
