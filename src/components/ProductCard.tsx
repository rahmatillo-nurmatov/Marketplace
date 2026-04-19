"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { useCartAnimation } from '@/contexts/CartAnimationContext';
import { ShoppingCart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { content } = useProductTranslation(product);
  const { flyToCart } = useCartAnimation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    // Fly animation
    if (btnRef.current && product.images[0]) {
      flyToCart(btnRef.current, product.images[0]);
    }

    // Brief checkmark feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
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

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', flex: 1, marginRight: '0.5rem' }}>
              {content.name}
            </h3>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.125rem', whiteSpace: 'nowrap' }}>${product.price}</div>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            {product.stock} {t('pcs')}
          </div>

          <button
            ref={btnRef}
            className="btn-neon"
            style={{
              width: '100%', padding: '0.75rem', marginTop: 'auto', fontSize: '0.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              background: added ? '#10B981' : undefined,
              boxShadow: added ? '0 4px 15px rgba(16,185,129,0.4)' : undefined,
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
            onClick={handleAddToCart}
          >
            {added
              ? <><Check size={16} /> {t('add_to_cart_success')}</>
              : <><ShoppingCart size={16} /> {t('add_to_cart')}</>
            }
          </button>
        </div>
      </Link>
    </div>
  );
}
