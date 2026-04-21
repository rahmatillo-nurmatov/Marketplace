"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider,
  signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile
} from 'firebase/auth';
import { auth, db } from '../lib/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'client' | 'seller' | 'admin';

// The one and only super-admin UID — cannot be demoted or blocked
const SUPER_ADMIN_UID = 'Irg2N5ijaaSl3J3TtDyljkdnzNy1';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  addresses?: string[];
  createdAt: number;
  blocked?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateRole: (role: UserRole) => Promise<void>;
  updateAddresses: (addresses: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null, profile: null, loading: true,
  signInWithGoogle: async () => {},
  signUpWithEmail: async () => {},
  signInWithEmail: async () => {},
  logout: async () => {},
  updateRole: async () => {},
  updateAddresses: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        let userProfile: UserProfile;

        if (userDoc.exists()) {
          userProfile = userDoc.data() as UserProfile;

          // Super-admin always has admin role — enforce on every login
          if (firebaseUser.uid === SUPER_ADMIN_UID && userProfile.role !== 'admin') {
            userProfile = { ...userProfile, role: 'admin', blocked: false };
            await setDoc(userDocRef, { role: 'admin', blocked: false }, { merge: true });
          }
        } else {
          // New user — default role is client (never admin unless super-admin UID)
          const role: UserRole = firebaseUser.uid === SUPER_ADMIN_UID ? 'admin' : 'client';
          userProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
            createdAt: Date.now(),
            blocked: false,
          };
          await setDoc(userDocRef, userProfile);
        }

        setProfile(userProfile);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(newUser, { displayName });
    const userDocRef = doc(db, 'users', newUser.uid);
    await setDoc(userDocRef, { displayName, createdAt: Date.now() }, { merge: true });
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateRole = async (newRole: UserRole) => {
    if (!user) return;
    // Super-admin cannot change their own role
    if (user.uid === SUPER_ADMIN_UID) return;
    // Regular users cannot self-assign admin role
    if (newRole === 'admin') return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { role: newRole }, { merge: true });
    setProfile(prev => prev ? { ...prev, role: newRole } : null);
  };

  const updateAddresses = async (newAddresses: string[]) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { addresses: newAddresses }, { merge: true });
    setProfile(prev => prev ? { ...prev, addresses: newAddresses } : null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logout, updateRole, updateAddresses }}>
      {children}
    </AuthContext.Provider>
  );
};
