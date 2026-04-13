"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { label: t('catalog'), path: '/', icon: '󰄋' },
    { label: t('cart'), path: '/cart', icon: '󰄗' },
    { label: t('history_expenses'), path: '/history', icon: '󰄉' },
    { label: t('profile'), path: '/profile', icon: '󰄔' },
  ];

  const adminItems = [
    { label: t('manage_products'), path: '/seller', icon: '󰄎' },
    { label: t('view_orders'), path: '/seller/orders', icon: '󰄕' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white', fontSize: '1.25rem' }}>L</div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px' }}>Lbitra</span>
      </div>

      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem' }}>Menu</p>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <div style={{ margin: '2rem 0', height: '1px', background: 'var(--border)' }} />

        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem' }}>Seller Hub</p>
        {adminItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="glass-card" style={{ padding: '1.25rem', marginTop: 'auto' }}>
        <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Premium Pro</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Get exclusive access to rare items.</p>
        <button className="btn-neon" style={{ width: '100%', fontSize: '0.75rem', padding: '0.6rem' }}>Upgrade Now</button>
      </div>
    </aside>
  );
}
