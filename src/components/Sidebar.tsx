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
    { label: 'Каталог', path: '/', icon: LayoutGrid },
    { label: 'Корзина', path: '/cart', icon: ShoppingCart },
    { label: 'История', path: '/history', icon: History },
    { label: 'Профиль', path: '/profile', icon: User },
  ];

  const adminItems = [
    { label: 'Мои товары', path: '/seller', icon: Package },
    { label: 'Заказы', path: '/seller/orders', icon: ClipboardList },
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
          Главное меню
        </p>
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} strokeWidth={2} />
            {item.label}
          </Link>
        ))}

        <div style={{ margin: '2rem 1.25rem', height: '1px', background: 'var(--border)' }} />

        <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '1.25rem', letterSpacing: '1px' }}>
          Панель продавца
        </p>
        {adminItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className={`nav-item ${pathname === item.path ? 'active' : ''}`}
          >
            <item.icon size={20} strokeWidth={2} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>© 2024 NurShop</p>
      </div>
    </aside>
  );
}
