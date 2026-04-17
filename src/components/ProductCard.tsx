"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <div 
      className="glass-card product-card-cyber" 
      onClick={handleCardClick}
      style={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
          <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', border: '1px solid rgba(138, 63, 252, 0.3)' }}>
             -{Math.round(((product.cost || 100) / product.price) * 10)}%
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
             <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{product.name}</h3>
             <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem' }}>${product.price}</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
             <div style={{ display: 'flex', color: '#F59E0B' }}>
                <Star size={14} fill="currentColor" />
             </div>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>4.8 (124 ratings)</span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
           <button 
             onClick={handleAddToCart}
             className="btn-neon" 
             style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem', background: 'rgba(138, 63, 252, 0.1)', border: '1px solid var(--primary)', color: 'white', boxShadow: 'none' }}
           >
              <ShoppingCart size={16} />
           </button>
           <div className="btn-neon" style={{ flex: 3, padding: '0.75rem', fontSize: '0.8rem' }}>
              Подробнее <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
           </div>
        </div>
        
        <div className="chart-line"></div>
      </div>
  );
}
