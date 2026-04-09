"use client";

import React, { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For MVp, fetch from Netlify functions
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="catalog-wrapper" style={{ padding: '2rem 0' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #4F46E5, #9333EA)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          Discover Amazing Products
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Explore our premium catalog.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading products...</div>
      ) : products.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 600 }}>No products found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Check back later or start selling!</p>
        </div>
      )}
    </div>
  );
}
