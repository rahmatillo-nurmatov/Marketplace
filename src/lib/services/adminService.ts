import {
  collection, getDocs, doc, updateDoc, deleteDoc,
  query, where, orderBy, getDoc, setDoc, addDoc, writeBatch
} from 'firebase/firestore';
import { db } from '../firebase/firebase';

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'client' | 'seller' | 'admin';
  blocked?: boolean;
  createdAt: number;
  addresses?: string[];
}

export interface Dispute {
  id: string;
  orderId: string;
  clientId: string;
  sellerId?: string;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  resolution?: string;
  createdAt: number;
}

export interface PlatformSettings {
  commissionRate: number;       // % platform takes from each sale
  sellerSubscriptionFee: number;
  platformName: string;
  primaryColor: string;
  logoUrl: string;
  termsText: string;
  privacyText: string;
  stripeKey: string;
  smtpHost: string;
}

const SETTINGS_DOC = 'platform/settings';

export const adminService = {
  // ── Users ──────────────────────────────────────────────
  async getAllUsers(): Promise<AdminUser[]> {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() } as AdminUser))
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async updateUserRole(uid: string, role: AdminUser['role']): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { role });
  },

  async blockUser(uid: string, blocked: boolean): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { blocked });
  },

  async deleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, 'users', uid));
  },

  // ── Orders (admin view) ────────────────────────────────
  async getAllOrdersAdmin() {
    const { orderService } = await import('./orderService');
    return orderService.getAllOrders();
  },

  async refundOrder(orderId: string): Promise<void> {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      refunded: true,
      updatedAt: Date.now()
    });
  },

  // ── Reviews ────────────────────────────────────────────
  async getAllReviews() {
    const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },

  async deleteReview(id: string): Promise<void> {
    await deleteDoc(doc(db, 'reviews', id));
  },

  // ── Disputes ───────────────────────────────────────────
  async getDisputes(): Promise<Dispute[]> {
    const snap = await getDocs(query(collection(db, 'disputes'), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Dispute));
  },

  async resolveDispute(id: string, resolution: string, refund: boolean, orderId: string): Promise<void> {
    const batch = writeBatch(db);
    batch.update(doc(db, 'disputes', id), { status: 'resolved', resolution, updatedAt: Date.now() });
    if (refund) batch.update(doc(db, 'orders', orderId), { status: 'cancelled', refunded: true, updatedAt: Date.now() });
    await batch.commit();
  },

  async rejectDispute(id: string, resolution: string): Promise<void> {
    await updateDoc(doc(db, 'disputes', id), { status: 'rejected', resolution, updatedAt: Date.now() });
  },

  // ── Platform Settings ──────────────────────────────────
  async getSettings(): Promise<PlatformSettings> {
    const snap = await getDoc(doc(db, SETTINGS_DOC));
    if (snap.exists()) return snap.data() as PlatformSettings;
    return {
      commissionRate: 5,
      sellerSubscriptionFee: 0,
      platformName: 'NurShop',
      primaryColor: '#8a3ffc',
      logoUrl: '',
      termsText: '',
      privacyText: '',
      stripeKey: '',
      smtpHost: '',
    };
  },

  async saveSettings(settings: Partial<PlatformSettings>): Promise<void> {
    await setDoc(doc(db, SETTINGS_DOC), settings, { merge: true });
  },

  // ── Analytics ─────────────────────────────────────────
  async getAnalytics() {
    const [usersSnap, ordersSnap, productsSnap, reviewsSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'orders')),
      getDocs(collection(db, 'products')),
      getDocs(collection(db, 'reviews')),
    ]);

    const orders = ordersSnap.docs.map(d => d.data());
    const users = usersSnap.docs.map(d => d.data());

    const gmv = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.total || 0), 0);
    const commission = gmv * 0.05;
    const sellers = users.filter(u => u.role === 'seller').length;
    const buyers = users.filter(u => u.role === 'client').length;

    // Top products by order frequency
    const productFreq: Record<string, { name: string; count: number; revenue: number }> = {};
    orders.forEach(o => {
      (o.items || []).forEach((item: any) => {
        if (!productFreq[item.productId]) productFreq[item.productId] = { name: item.name, count: 0, revenue: 0 };
        productFreq[item.productId].count += item.quantity;
        productFreq[item.productId].revenue += item.price * item.quantity;
      });
    });
    const topProducts = Object.entries(productFreq)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Monthly GMV (last 6 months)
    const now = Date.now();
    const monthlyGmv = Array.from({ length: 6 }, (_, i) => {
      const start = now - (i + 1) * 30 * 24 * 3600 * 1000;
      const end = now - i * 30 * 24 * 3600 * 1000;
      const total = orders
        .filter(o => o.createdAt >= start && o.createdAt < end && o.status !== 'cancelled')
        .reduce((s, o) => s + (o.total || 0), 0);
      const d = new Date(end);
      return { month: d.toLocaleString('default', { month: 'short' }), total };
    }).reverse();

    return {
      gmv, commission,
      totalOrders: orders.length,
      totalUsers: usersSnap.size,
      sellers, buyers,
      totalProducts: productsSnap.size,
      totalReviews: reviewsSnap.size,
      topProducts,
      monthlyGmv,
    };
  },

  // ── CSV Export ─────────────────────────────────────────
  exportCsv(data: Record<string, any>[], filename: string) {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csv = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  },
};
