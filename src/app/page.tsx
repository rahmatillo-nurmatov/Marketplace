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
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), #9333EA)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
          {t('hero_title')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{t('hero_subtitle')}</p>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '1rem', 
        marginBottom: '4rem',
        overflowX: 'auto',
        padding: '0.5rem',
        scrollbarWidth: 'none'
      }}>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className="btn-primary"
            style={{
              width: 'auto',
              padding: '0.75rem 2rem',
              fontSize: '1rem',
              fontWeight: 600,
              background: selectedCategory === cat.id ? 'var(--primary)' : 'var(--bg-card)',
              color: selectedCategory === cat.id ? 'white' : 'var(--text-main)',
              border: '1px solid var(--border)',
              borderRadius: '50px',
              whiteSpace: 'nowrap',
              transition: 'all 0.3s ease',
              boxShadow: selectedCategory === cat.id ? '0 10px 20px rgba(79, 70, 229, 0.3)' : 'none'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>{t('loading_products')}</div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
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
