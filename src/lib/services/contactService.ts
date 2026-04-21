import {
  collection, addDoc, getDocs, doc,
  updateDoc, query, orderBy, where
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
    const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
  },

  async getByRole(role: 'client' | 'seller'): Promise<ContactMessage[]> {
    const snap = await getDocs(
      query(collection(db, COL), where('senderRole', '==', role), orderBy('createdAt', 'desc'))
    );
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
  },

  async markRead(id: string): Promise<void> {
    await updateDoc(doc(db, COL, id), { status: 'read' });
  },

  async reply(id: string, reply: string): Promise<void> {
    await updateDoc(doc(db, COL, id), { reply, status: 'replied' });
  },

  async delete(id: string): Promise<void> {
    const { deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, COL, id));
  },
};
