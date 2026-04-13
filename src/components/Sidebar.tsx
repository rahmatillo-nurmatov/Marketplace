"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  LayoutGrid, 
  ShoppingCart, 
  History, 
  User, 
  Package, 
  ClipboardList, 
  Store
} from 'lucide-react';

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { label: t('sidebar_home'), path: '/', icon: LayoutGrid },
    { label: t('sidebar_cart'), path: '/cart', icon: ShoppingCart },
    { label: t('sidebar_history'), path: '/history', icon: History },
    { label: t('sidebar_profile'), path: '/sidebar_profile' ? t('sidebar_profile') : 'Профиль', path: '/profile', icon: User },
  ];

  const adminItems = [
    { label: t('sidebar_products'), path: '/seller', icon: Package },
    { label: t('sidebar_orders'), path: '/seller/orders', icon: ClipboardList },
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
          borderRadius: '12px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 0 15px var(--primary-glow)' 
        }}>
          <Store size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px', background: 'linear-gradient(to right, #fff, #8b8a91)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          NurShop
        </span>
      </div>

      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem', letterSpacing: '1px' }}>
          {t('all_categories')}
        </p>
        <Link 
          href="/" 
          className={`nav-item ${pathname === '/' ? 'active' : ''}`}
        >
          <LayoutGrid size={20} strokeWidth={2} />
          {t('sidebar_home')}
        </Link>
        <Link 
          href="/cart" 
          className={`nav-item ${pathname === '/cart' ? 'active' : ''}`}
        >
          <ShoppingCart size={20} strokeWidth={2} />
          {t('sidebar_cart')}
        </Link>
        <Link 
          href="/history" 
          className={`nav-item ${pathname === '/history' ? 'active' : ''}`}
        >
          <History size={20} strokeWidth={2} />
          {t('sidebar_history')}
        </Link>
        <Link 
          href="/profile" 
          className={`nav-item ${pathname === '/profile' ? 'active' : ''}`}
        >
          <User size={20} strokeWidth={2} />
          {t('sidebar_profile')}
        </Link>

        <div style={{ margin: '2rem 1.25rem', height: '1px', background: 'var(--border)' }} />

        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem', letterSpacing: '1px' }}>
          {t('store_management')}
        </p>
        <Link 
          href="/seller" 
          className={`nav-item ${pathname === '/seller' ? 'active' : ''}`}
        >
          <Package size={20} strokeWidth={2} />
          {t('sidebar_products')}
        </Link>
        <Link 
          href="/seller/orders" 
          className={`nav-item ${pathname === '/seller/orders' ? 'active' : ''}`}
        >
          <ClipboardList size={20} strokeWidth={2} />
          {t('sidebar_orders')}
        </Link>
      </nav>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2024 NurShop</p>
      </div>
    </aside>
  );
}
