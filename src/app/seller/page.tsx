"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Edit3, Trash2, Package, Search, Filter, ArrowUpRight, DollarSign, Layers } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const fetchProducts = () => {
    if (user?.uid) {
      setLoading(true);
      productService.getSellerProducts(user.uid)
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             p.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'stock') return a.stock - b.stock;
        return b.createdAt - a.createdAt; // newest
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleDelete = async (id: string) => {
    if (window.confirm(t('delete_confirm'))) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('Ошибка при удалении');
      }
    }
  };

  const statCardStyle = {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
    flex: 1
  };

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('sidebar_products')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Управление ассортиментом и аналитика вашего магазина</p>
          </div>
          <button className="btn-neon" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2rem' }}>
            <Plus size={20} />
            {t('add_new_product')}
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-card" style={statCardStyle}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Всего товаров</span>
                <Package size={16} />
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 800 }}>{products.length}</div>
          </div>
          <div className="glass-card" style={statCardStyle}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Общая стоимость</span>
                <DollarSign size={16} />
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 800 }}>${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()}</div>
          </div>
          <div className="glass-card" style={statCardStyle}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Категории</span>
                <Layers size={16} />
             </div>
             <div style={{ fontSize: '2rem', fontWeight: 800 }}>{new Set(products.map(p => p.categoryId)).size}</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-card" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Поиск по названию или описанию..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '12px', color: 'white', outline: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Все категории</option>
              <option value="electronics">Электроника</option>
              <option value="clothes">Одежда</option>
              <option value="furniture">Мебель</option>
            </select>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.75rem 1rem', borderRadius: '12px', color: 'white', outline: 'none', cursor: 'pointer' }}
            >
              <option value="newest">Сначала новые</option>
              <option value="price-high">Дорогие</option>
              <option value="price-low">Дешевые</option>
              <option value="stock">Мало на складе</option>
            </select>
          </div>
        </div>

        {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} onSuccess={fetchProducts} />}
        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSuccess={fetchProducts} 
          />
        )}

        {/* Product List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>{t('processing')}</div>
        ) : filteredProducts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredProducts.map(product => (
              <div key={product.id} className="glass-card" style={{ display: 'grid', gridTemplateColumns: '80px 1.5fr 1fr 1fr 120px', alignItems: 'center', padding: '1rem 2rem', gap: '2rem' }}>
                {/* Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: '12px', background: 'var(--bg-side)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.25rem' }}>{product.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>{product.categoryId}</div>
                </div>

                {/* Financials */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Цена / Себест.</div>
                  <div style={{ fontWeight: 700 }}>
                    <span style={{ color: 'white' }}>${product.price.toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>/</span>
                    <span style={{ color: 'var(--text-muted)' }}>${product.cost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Variation & Stock */}
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Запасы / Варианты</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontWeight: 700, 
                      color: product.stock < 10 ? '#EF4444' : '#10B981' 
                    }}>
                      {product.stock} шт.
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      ({(product.colors?.length || 0) + (product.sizes?.length || 0)} вар.)
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="glass-card"
                    style={{ padding: '0.6rem', borderRadius: '8px', color: 'var(--accent)', cursor: 'pointer' }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="glass-card"
                    style={{ padding: '0.6rem', borderRadius: '8px', color: '#EF4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '6rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto' }} />
              Ничего не найдено по вашему запросу
            </div>
            {(searchQuery || selectedCategory !== 'all') && (
              <button className="btn-neon" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>Сбросить фильтры</button>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
