"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCart } from '@/contexts/CartContext';
import {
  Menu, ShoppingBag, LayoutGrid, ShoppingCart,
  History, User, Sun, Moon
} from 'lucide-react';

export function MobileLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { items } = useCart();

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="app-container">
      {/* Desktop sidebar — always visible on desktop */}
      <div className="desktop-sidebar">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <main className="main-content">
        {/* Desktop navbar */}
        <div className="desktop-navbar">
          <Navbar />
        </div>

        {/* Mobile header */}
        <header className="mobile-header">
          <button
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', padding: '4px' }}
          >
            <Menu size={24} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag color="white" size={16} />
            </div>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.5px' }}>NurShop</span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
            >
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link href="/cart" style={{ position: 'relative', color: 'var(--text-muted)', display: 'flex' }}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: '-6px', right: '-6px',
                  background: 'var(--primary)', color: 'white',
                  borderRadius: '50%', width: '16px', height: '16px',
                  fontSize: '0.6rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </header>

        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="mobile-nav">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>
          <LayoutGrid size={22} />
          <span>{t('catalog')}</span>
        </Link>
        <Link href="/cart" className={pathname === '/cart' ? 'active' : ''} style={{ position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-6px', right: '-6px',
                background: 'var(--primary)', color: 'white',
                borderRadius: '50%', width: '16px', height: '16px',
                fontSize: '0.6rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </div>
          <span>{t('cart')}</span>
        </Link>
        <Link href="/history" className={pathname === '/history' ? 'active' : ''}>
          <History size={22} />
          <span>{t('sidebar_history')}</span>
        </Link>
        <Link href={user ? '/profile' : '/login'} className={pathname === '/profile' ? 'active' : ''}>
          <User size={22} />
          <span>{t('profile')}</span>
        </Link>
      </nav>
    </div>
  );
}
