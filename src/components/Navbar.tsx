"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileMenu } from './ProfileMenu';

export function Navbar() {
  const { user, profile, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <span>Market</span><span style={{ color: 'var(--primary)' }}>place</span>
        </Link>
        <nav className="navbar-links">
          <Link href="/" className="navbar-link">Catalog</Link>
          
          {user ? (
            <>
              <Link href="/cart" className="navbar-link">Cart</Link>
              {profile?.role === 'admin' && <Link href="/admin" className="navbar-link">Admin</Link>}
              {profile?.role === 'seller' && <Link href="/seller" className="navbar-link">Dashboard</Link>}
              <ProfileMenu />
            </>
          ) : (
            <Link href="/login" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
