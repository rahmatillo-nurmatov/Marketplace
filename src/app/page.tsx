"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { productService } from '@/lib/services/productService';
import { Product } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowRight, Star, Search, Filter, 
  ChevronDown, SlidersHorizontal, ArrowUpDown, X, Hash
} from 'lucide-react';

function HomeContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // States for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showFilters, setShowFilters] = useState(false);

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

  // Combined Filtering Logic
  useEffect(() => {
    let result = [...products].filter(p => p.status === 'approved');

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // 3. Price Filter
    result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

    // 4. Sorting
    switch (selectedSort) {
      case 'price_low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        break;
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, selectedSort, priceRange, products]);

  const handleCategoryChange = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') params.delete('category');
    else params.set('category', id);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const categories = [
    { id: 'all', label: t('all_categories') },
    { id: 'electronics', label: t('electronics') },
    { id: 'clothes', label: t('clothes') },
    { id: 'furniture', label: t('furniture') }
  ];

  return (
    <div style={{ paddingBottom: '6rem' }}>
      
      {/* Hero Section */}
      <div className="glass-card" style={{ 
        height: '380px',
        marginBottom: '3rem', 
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        borderRadius: '32px'
      }}>
        {slides.map((slide, index) => (
          <div 
            key={index}
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1s ease-in-out',
              display: 'flex', padding: '4rem'
            }}
          >
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', marginBottom: '1rem' }}>
                <Star size={16} fill="var(--accent)" />
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px' }}>Trending Now</span>
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1 }}>{slide.title}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.25rem', marginBottom: '2rem' }}>{slide.desc}</p>
              <button className="btn-neon" style={{ alignSelf: 'flex-start', padding: '1rem 2rem' }}>{t('view_catalog')}</button>
            </div>
            
            <img 
              src={slide.img} 
              alt="" 
              style={{ 
                position: 'absolute', right: 0, top: 0, width: '60%', height: '100%', 
                objectFit: 'cover', maskImage: 'linear-gradient(to left, black 60%, transparent)',
                WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent)',
                opacity: 0.8
              }} 
            />
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to right, ${slide.color}, transparent)`, zIndex: 1 }} />
          </div>
        ))}
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div style={{ position: 'sticky', top: '1rem', zIndex: 100, marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Search Bar */}
              <div style={{ flex: 1, position: 'relative' }}>
                 <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                 <input 
                   placeholder={t('search_products')}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   style={{ 
                     width: '100%', padding: '0.8rem 1rem 0.8rem 3rem', background: 'rgba(255,255,255,0.03)', 
                     border: '1px solid var(--border)', borderRadius: '12px', color: 'white', outline: 'none' 
                   }}
                 />
                 {searchQuery && (
                   <X size={16} onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.5 }} />
                 )}
              </div>

              {/* Category Dropdown (Mobile simplified to toolbar) */}
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '2px' }} className="hide-scrollbar">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    style={{
                      padding: '0.75rem 1.25rem', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 600,
                      background: selectedCategory === cat.id ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                      color: selectedCategory === cat.id ? 'white' : 'var(--text-muted)',
                      border: selectedCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--border)',
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="glass-card" 
                style={{ padding: '0.8rem', borderRadius: '12px', cursor: 'pointer', border: showFilters ? '1px solid var(--primary)' : '1px solid var(--border)', color: showFilters ? 'var(--primary)' : 'white' }}
              >
                 <SlidersHorizontal size={18} />
              </button>
           </div>

           {/* Expandable Advanced Filters */}
           {showFilters && (
             <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                <div>
                   <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ArrowUpDown size={14} /> {t('sort_by')}
                   </h4>
                   <select 
                     value={selectedSort}
                     onChange={(e) => setSelectedSort(e.target.value)}
                     style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                   >
                      <option value="newest" style={{ background: '#12121e' }}>{t('sort_newest')}</option>
                      <option value="price_low" style={{ background: '#12121e' }}>{t('sort_price_low')}</option>
                      <option value="price_high" style={{ background: '#12121e' }}>{t('sort_price_high')}</option>
                   </select>
                </div>

                <div>
                   <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Hash size={14} /> {t('filter_price')}
                   </h4>
                   <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="number" 
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                        placeholder="Min"
                      />
                      <span style={{ opacity: 0.3 }}>-</span>
                      <input 
                        type="number" 
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                        style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }}
                        placeholder="Max"
                      />
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>{t('catalog')}</h2>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>Найдено: {filteredProducts.length} товаров</span>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '8rem 0' }}>
           <div style={{ 
             width: '40px', height: '40px', border: '4px solid var(--primary)', 
             borderTopColor: 'transparent', borderRadius: '50%', 
             margin: '0 auto 1.5rem', animation: 'spin 1s linear infinite' 
           }}></div>
           <p style={{ color: 'var(--text-muted)' }}>{t('loading_products')}</p>
        </div>
      ) : filteredProducts.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '8rem 0', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '1px dashed var(--border)' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
             <Search size={32} style={{ opacity: 0.2 }} />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', fontWeight: 800 }}>{t('no_products')}</h3>
          <p style={{ color: 'var(--text-muted)' }}>Попробуйте изменить параметры поиска или фильтры</p>
          <button 
            onClick={() => { setSearchQuery(''); handleCategoryChange('all'); setPriceRange({ min: 0, max: 10000 }); }} 
            style={{ marginTop: '2rem', background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
          >
             Сбросить все фильтры
          </button>
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
