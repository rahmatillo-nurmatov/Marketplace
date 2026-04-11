"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, user, profile, loading } = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && profile && !loading) {
      if (profile.role === 'admin') router.push('/admin');
      else if (profile.role === 'seller') router.push('/seller');
      else router.push('/');
    }
  }, [user, profile, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    try {
      if (isRegister) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') setAuthError('Email already in use.');
      else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') setAuthError('Invalid email or password.');
      else if (err.code === 'auth/weak-password') setAuthError('Password should be at least 6 characters.');
      else setAuthError(err.message || 'Failed to authenticate.');
    } finally {
      setSubmitting(false);
    }
  };

  const formMargin = { marginBottom: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem', textAlign: 'left' as const };

  return (
    <div className="auth-wrapper" style={{ padding: '4rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div className="auth-card" style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h1 className="auth-title" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Marketplace</h1>
        <p className="auth-subtitle" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          {isRegister ? 'Create a new account' : 'Sign in to your account'}
        </p>

        {authError && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger, #ef4444)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--danger, #ef4444)' }}>{authError}</div>}

        <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
          {isRegister && (
            <div style={formMargin}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Full Name</label>
              <input type="text" required={isRegister} value={name} onChange={e => setName(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} placeholder="John Doe" />
            </div>
          )}
          <div style={formMargin}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} placeholder="your@email.com" />
          </div>
          <div style={formMargin}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', width: '100%' }} placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading || submitting} className="btn-primary" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            {submitting ? 'Processing...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ position: 'relative', margin: '1.5rem 0' }}>
          <hr style={{ borderTop: '1px solid var(--border)' }} />
          <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--bg-card)', padding: '0 0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading || submitting}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-color)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem' }}>
          {isRegister ? "Already have an account? " : "Don't have an account? "}
          <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}>
            {isRegister ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
