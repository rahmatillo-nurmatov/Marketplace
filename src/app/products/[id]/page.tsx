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
    <div className="container" style={{ padding: '4rem 0' }}>
      <button 
        onClick={() => router.back()} 
        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        ← {t('back_to_catalog')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img 
            src={product.images[0] || 'https://via.placeholder.com/600x400'} 
            alt={displayName} 
            style={{ width: '100%', height: 'auto', display: 'block' }} 
          />
        </div>

        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{displayName}</h1>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '2rem' }}>${product.price.toFixed(2)}</div>
          
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>{t('description')}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.125rem' }}>{displayDesc}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{t('status')}</span>
              <span style={{ fontWeight: 600, color: product.stock > 0 ? '#10B981' : 'var(--danger)' }}>
                {product.stock > 0 ? t('stock') + `: ${product.stock}` : 'Out of Stock'}
              </span>
            </div>
            
            {user ? (
              <button 
                onClick={() => addToCart(product)}
                disabled={product.stock <= 0}
                className="btn-primary" 
                style={{ padding: '1.25rem', fontSize: '1.125rem' }}
              >
                {t('add_to_cart')}
              </button>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="btn-primary" 
                style={{ padding: '1.25rem', fontSize: '1.125rem' }}
              >
                {t('login')} to Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
