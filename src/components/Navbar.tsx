"use client";

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileMenu } from './ProfileMenu';

export function Navbar() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <span>Market</span><span style={{ color: 'var(--primary)' }}>place</span>
        </Link>
        <nav className="navbar-links">
          <Link href="/" className="navbar-link">{t('catalog')}</Link>
          
          {user ? (
            <>
              <Link href="/cart" className="navbar-link">{t('cart')}</Link>
              {profile?.role === 'admin' && <Link href="/admin" className="navbar-link">{t('admin')}</Link>}
              {profile?.role === 'admin' && <Link href="/admin" className="navbar-link">{t('admin')}</Link>}
              <ProfileMenu />
            </>
          ) : (
            <Link href="/login" className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              {t('login')}
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
