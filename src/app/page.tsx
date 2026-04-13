"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/lib/services/productService';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';

function HomeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const selectedCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    productService.getProducts()
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.categoryId === selectedCategory));
    }
  }, [selectedCategory, products]);

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const categories = [
    { id: 'all', label: t('all_categories') },
    { id: 'electronics', label: t('electronics') },
    { id: 'clothes', label: t('clothes') },
    { id: 'furniture', label: t('furniture') }
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Search Sub-Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className="glass-card"
              style={{
                width: 'auto',
                padding: '0.6rem 1.25rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                background: selectedCategory === cat.id ? 'rgba(138, 63, 252, 0.15)' : 'var(--bg-card)',
                color: selectedCategory === cat.id ? 'var(--primary)' : 'var(--text-muted)',
                borderColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '12px',
                cursor: 'pointer'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          See All →
        </div>
      </div>

      {/* Hero Banner */}
      <div className="glass-card" style={{ 
        padding: '3rem', 
        marginBottom: '4rem', 
        background: 'linear-gradient(135deg, rgba(138, 63, 252, 0.2), rgba(0, 224, 255, 0.05))',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(138, 63, 252, 0.3)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{t('hero_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '2rem' }}>{t('hero_subtitle')}</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-neon">Explore Now</button>
            <button className="glass-card" style={{ padding: '0.8rem 1.5rem', fontWeight: 600 }}>Whitepaper</button>
          </div>
        </div>
        
        {/* Abstract shapes to mimic the crypto card in the image */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', width: '300px', height: '180px', background: 'linear-gradient(135deg, #8a3ffc, #4F46E5)', borderRadius: '20px', opacity: 0.6, boxShadow: '0 0 50px rgba(138, 63, 252, 0.3)' }} />
        <div style={{ position: 'absolute', right: '10%', top: '40%', width: '100px', height: '100px', background: 'var(--accent)', borderRadius: '50%', filter: 'blur(40px)', opacity: 0.3 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Items</h2>
        <div style={{ color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>View all catalog →</div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>{t('loading_products')}</div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '6rem 0', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', backdropFilter: 'blur(16px)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>{t('no_products')}</h3>
          <p style={{ color: 'var(--text-muted)' }}>{t('hero_subtitle')}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
