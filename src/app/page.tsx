"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/lib/services/productService';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowRight, Star } from 'lucide-react';

function HomeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const selectedCategory = searchParams.get('category') || 'all';

  const slides = [
    {
      title: t('hero_slide1_title'),
      desc: t('hero_slide1_desc'),
      color: 'rgba(138, 63, 252, 0.2)',
      img: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=1200'
    },
    {
      title: t('hero_slide2_title'),
      desc: t('hero_slide2_desc'),
      color: 'rgba(0, 224, 255, 0.2)',
      img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
        <button 
          onClick={() => handleCategoryChange('all')}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {t('see_all')} <ArrowRight size={14} />
        </button>
      </div>

      {/* Hero Carousel Banner */}
      <div className="glass-card" style={{ 
        height: '320px',
        marginBottom: '4rem', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0, 
              width: '100%',
              height: '100%',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              display: 'flex',
              padding: '3rem'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                <Star size={16} fill="var(--accent)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Special Offer</span>
              </div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{slide.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem' }}>{slide.desc}</p>
            </div>
            
            <img 
              src={slide.img} 
              alt="" 
              style={{ 
                position: 'absolute', 
                right: 0, 
                top: 0, 
                width: '60%', 
                height: '100%', 
                objectFit: 'cover',
                maskImage: 'linear-gradient(to left, black 60%, transparent)',
                WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent)',
                opacity: 0.8
              }} 
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${slide.color}, transparent)`, zIndex: 1 }} />
          </div>
        ))}
        
        {/* Carousel Indicators */}
        <div style={{ position: 'absolute', bottom: '1.5rem', left: '3rem', display: 'flex', gap: '0.5rem', zIndex: 3 }}>
          {slides.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              style={{ 
                width: i === currentSlide ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: i === currentSlide ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }} 
            />
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{t('all_categories')}</h2>
        <button 
          onClick={() => handleCategoryChange('all')}
          style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
        >
          {t('view_catalog')}
        </button>
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
