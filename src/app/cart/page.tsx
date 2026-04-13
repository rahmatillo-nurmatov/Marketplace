"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem' }}>{t('cart')}</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t('empty_cart')}</h2>
            <Link href="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto', padding: '0.75rem 2rem' }}>
              {t('back_to_catalog')}
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {items.map((item) => (
                <div key={item.id} style={{ 
                  display: 'flex', 
                  gap: '1.5rem', 
                  background: 'var(--bg-card)', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius)', 
                  border: '1px solid var(--border)',
                  alignItems: 'center'
                }}>
                  <img src={item.images[0]} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>{t(item.name as any) || item.name}</h3>
                    <div style={{ color: 'var(--primary)', fontWeight: 700 }}>${item.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>-</button>
                      <span style={{ padding: '0 1rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.5rem 1rem', background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>{t('remove')}</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>{t('checkout')}</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
                  <span>{t('total_price')}</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
                <Link href="/checkout" className="btn-primary" style={{ textAlign: 'center' }}>
                  {t('go_to_checkout')}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
