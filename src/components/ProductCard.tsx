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
    <Link href={`/products/${product.id}`} className="glass-card product-card-cyber" style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '2px' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--bg-side)', overflow: 'hidden' }}>
            <img src={product.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{displayName}</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{product.stock} items left</p>
        </div>
      </div>

      <div style={{ position: 'relative', height: '100px', marginBottom: '1.25rem', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
        <img src={product.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        <div className="chart-line" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Mkt Price</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>${product.price.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>ROI Est.</p>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#10B981' }}>+{(Math.random() * 10 + 2).toFixed(2)}%</p>
        </div>
      </div>

      <button onClick={handleAddToCart} className="btn-neon" style={{ width: '100%', borderRadius: '12px' }}>
        {t('add_to_cart')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Win Rate</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{(Math.random() * 30 + 60).toFixed(2)}%</p>
        </div>
        <div>
          <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Max DD</p>
          <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{(Math.random() * 5 + 5).toFixed(2)}%</p>
        </div>
      </div>
    </Link>
  );
}
