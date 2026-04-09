"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signInWithGoogle, user, profile, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user && profile && !loading) {
      if (profile.role === 'admin') router.push('/admin');
      else if (profile.role === 'seller') router.push('/seller');
      else router.push('/catalog');
    }
  }, [user, profile, loading, router]);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Merketplace</h1>
        <p className="auth-subtitle">Sign in to start shopping or managing your store.</p>
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Processing...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
