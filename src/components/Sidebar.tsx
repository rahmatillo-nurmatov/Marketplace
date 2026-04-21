"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCartAnimation } from '@/contexts/CartAnimationContext';
import { ContactModal } from './ContactModal';
import { 
  LayoutGrid, ShoppingCart, History, User, 
  Package, ShoppingBag, ShieldCheck, LogOut, MessageSquare, X, Mail
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { profile, logout } = useAuth();
  const { cartIconRef } = useCartAnimation();
  const [showContact, setShowContact] = useState(false);
  
  const userRole = profile?.role || 'client';

  const commonItems = [
    { label: t('sidebar_home'), path: '/', icon: LayoutGrid },
    { label: t('sidebar_cart'), path: '/cart', icon: ShoppingCart },
    { label: t('sidebar_history'), path: '/history', icon: History },
    { label: t('sidebar_profile'), path: '/profile', icon: User },
  ];

  const sellerItems = [
    { label: t('sidebar_products'), path: '/seller', icon: Package },
    { label: t('sidebar_orders'), path: '/seller/orders', icon: ShoppingBag },
    { label: t('sidebar_reviews'), path: '/seller/reviews', icon: MessageSquare },
  ];

  const adminItems = [
    { label: t('sidebar_admin_panel'), path: '/admin', icon: ShieldCheck },
  ];

  const handleLinkClick = () => {
    onClose?.();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}

      <aside
        className={`sidebar${isOpen ? ' open' : ''}`}
        style={{
          width: '280px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          background: 'var(--bg-side)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem 1.5rem',
          zIndex: 200
        }}
      >
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 0.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px var(--primary-glow)', flexShrink: 0 }}>
            <ShoppingBag color="white" size={24} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-1px', flex: 1 }}>NurShop</span>
          {/* Close button — only visible on mobile */}
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px', display: 'none' }}
            className="sidebar-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '1.25rem' }}>
            {t('menu_main')}
          </p>
          {commonItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={handleLinkClick}
              ref={item.path === '/cart' ? (el) => { if (el) cartIconRef.current = el; } : undefined}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}

          {(userRole === 'seller' || userRole === 'admin') && (
            <>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2.5rem', marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                {t('menu_sales')}
              </p>
              {sellerItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {userRole === 'admin' && (
            <>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2.5rem', marginBottom: '1rem', paddingLeft: '1.25rem' }}>
                {t('menu_admin')}
              </p>
              {adminItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path} 
                  className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                  onClick={handleLinkClick}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0 1rem 1.5rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
              {profile?.email?.[0].toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profile?.displayName || 'User'}</p>
              <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{userRole}</p>
            </div>
          </div>

          {/* Contact us */}
          <button
            onClick={() => { setShowContact(true); onClose?.(); }}
            style={{ width: '100%', background: 'rgba(0,224,255,0.07)', color: 'var(--accent)', border: '1px solid rgba(0,224,255,0.2)', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginBottom: '0.75rem' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(0,224,255,0.14)'}
            onMouseOut={e => e.currentTarget.style.background = 'rgba(0,224,255,0.07)'}
          >
            <Mail size={16} />
            {t('contact_us')}
          </button>

          <button 
            onClick={() => { logout(); onClose?.(); }}
            style={{ width: '100%', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: 'none', padding: '0.8rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
          >
            <LogOut size={18} />
            {t('logout')}
          </button>
        </div>
      </aside>

      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
