"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const displayName = t(product.name as any) || product.name;
  const displayDesc = t(`${product.name}_desc` as any) || product.description;

  return (
    <Link href={`/products/${product.id}`} className="product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-card)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      transition: 'all 0.3s ease'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'var(--shadow)';
    }}>
      <div style={{ width: '100%', height: '200px', backgroundImage: `url(${product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{displayName}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexGrow: 1 }}>{displayDesc.substring(0, 80)}...</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
          {user && (
            <button 
              onClick={handleAddToCart}
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              {t('add_to_cart')}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
