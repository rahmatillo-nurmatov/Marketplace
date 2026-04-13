"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      productService.getProductById(id as string)
        .then(data => {
          setProduct(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>{t('processing')}</div>;
  if (!product) return <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>{t('no_products')}</div>;

  const displayName = t(product.name as any) || product.name;
  const displayDesc = t(`${product.name}_desc` as any) || product.description;

  return (
    <div style={{ padding: '2rem 0' }}>
      <button 
        onClick={() => router.back()} 
        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '1rem' }}
      >
        ← {t('back_to_catalog')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '5rem', alignItems: 'start' }}>
        <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-focus)' }}>
          <img 
            src={product.images[0] || 'https://via.placeholder.com/600x400'} 
            alt={displayName} 
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 'var(--radius-md)' }} 
          />
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <span className="badge-pro">Featured Item</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>ID: {product.id}</span>
          </div>
          
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-2px' }}>{displayName}</h1>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '3rem', textShadow: '0 0 30px rgba(138, 63, 252, 0.4)' }}>${product.price.toFixed(2)}</div>
          
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '3rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>{t('description')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.125rem' }}>{displayDesc}</p>
          </div>

          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Availability Status</span>
              <span style={{ fontWeight: 800, color: product.stock > 0 ? '#10B981' : '#EF4444', background: product.stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '4px 12px', borderRadius: '6px' }}>
                {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
              </span>
            </div>
            
            {user ? (
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="btn-neon" 
                style={{ padding: '1.5rem', fontSize: '1.25rem', borderRadius: '16px' }}
              >
                {t('add_to_cart')}
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="btn-neon" 
                style={{ padding: '1.5rem', fontSize: '1.25rem', borderRadius: '16px' }}
              >
                {t('login')} to Purchase
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
