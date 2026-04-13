"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/lib/services/productService';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id && typeof params.id === 'string') {
      productService.getProductById(params.id)
        .then(found => {
          if (found) setProduct(found);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [params.id]);

  if (loading) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Product not found</div>;

  const mainImage = product.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image';

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <button 
        onClick={() => router.back()} 
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        ← Back to Catalog
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '4rem' }}>
        <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
          <img src={mainImage} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>{product.name}</h1>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '2rem' }}>
            ${product.price.toFixed(2)}
          </div>
          
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{product.description}</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ color: 'var(--text-muted)' }}>
              In Stock: <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{product.stock}</span> units
            </div>
            {user ? (
              <button className="btn-primary" style={{ flexGrow: 1, padding: '1rem' }}>
                Add to Cart
              </button>
            ) : (
              <button className="btn-primary" style={{ flexGrow: 1, padding: '1rem' }} onClick={() => router.push('/login')}>
                Login to Buy
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
