"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const mainImage = product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image';

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`} className="product-card" style={{
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bg-card)',
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
      <div style={{ width: '100%', height: '200px', backgroundImage: `url(${mainImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-main)', margin: '0 0 0.5rem 0' }}>{product.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', flexGrow: 1 }}>{product.description.substring(0, 80)}...</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(product.price)}</span>
          {user && (
            <button 
              onClick={handleAddToCart}
              className="btn-primary" 
              style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
