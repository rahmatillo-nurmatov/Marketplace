import {
  collection, addDoc, getDocs, doc,
  updateDoc, deleteDoc, query, orderBy, where
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { ContactMessage } from '@/types';

const COL = 'contact_messages';

export const contactService = {
  async sendMessage(data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>): Promise<void> {
    await addDoc(collection(db, COL), {
      ...data,
      status: 'new',
      createdAt: Date.now(),
    });
  },

  async getAll(): Promise<ContactMessage[]> {
    // No orderBy to avoid composite index requirement
    const snap = await getDocs(collection(db, COL));
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as ContactMessage))
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getByRole(role: 'client' | 'seller'): Promise<ContactMessage[]> {
    // Only where() — no orderBy to avoid needing a Firestore composite index
    const snap = await getDocs(
      query(collection(db, COL), where('senderRole', '==', role))
    );
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as ContactMessage))
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, COL, id), { status: 'read' });
  },

  async reply(id: string, reply: string): Promise<void> {
    await updateDoc(doc(db, COL, id), { reply, status: 'replied' });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COL, id));
  },
};
