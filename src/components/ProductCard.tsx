"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Star } from 'lucide-react';

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
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>{product.stock} {t('stock')}</p>
        </div>
      </div>

      <div style={{ position: 'relative', height: '120px', marginBottom: '1.25rem', borderRadius: '12px', overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}>
        <img src={product.images?.[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
        <div className="chart-line" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{t('price')}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>${product.price.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>{t('rating')}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#FBBF24' }}>
            <Star size={14} fill="#FBBF24" />
            <span style={{ fontWeight: 800, fontSize: '1rem' }}>{(Math.random() * 1.5 + 3.5).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <button onClick={handleAddToCart} className="btn-neon" style={{ width: '100%', borderRadius: '12px', fontWeight: 700 }}>
        {t('add_to_cart')}
      </button>

      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'center' }}>
         <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t(product.categoryId as any)}</span>
      </div>
    </Link>
  );
}
