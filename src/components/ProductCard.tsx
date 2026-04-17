"use client";

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { content } = useProductTranslation(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="glass-card product-card-cyber" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Link href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem' }}>
          <img 
            src={product.images[0]} 
            alt={content.name} 
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
             <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', transition: 'opacity 0.3s' }}>
                {content.name}
             </h3>
             <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem' }}>${product.price}</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
             <div style={{ display: 'flex', color: '#F59E0B' }}>
                <Star size={14} fill="currentColor" />
             </div>
             <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>4.8 (124 ratings)</span>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'opacity 0.3s' }}>
            {content.description}
          </p>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
         <button 
           onClick={handleAddToCart}
           className="btn-neon" 
           style={{ flex: 1, padding: '0.75rem', fontSize: '0.8rem', background: 'rgba(138, 63, 252, 0.1)', border: '1px solid var(--primary)', color: 'white', boxShadow: 'none' }}
         >
            <ShoppingCart size={16} />
         </button>
         <Link href={`/product/${product.id}`} className="btn-neon" style={{ flex: 3, padding: '0.75rem', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Подробнее <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
         </Link>
      </div>
      
      <div className="chart-line"></div>
    </div>
  );
}
