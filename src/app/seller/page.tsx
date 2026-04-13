"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Edit3, Trash2, Package } from 'lucide-react';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('Ошибка при удалении');
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Мои товары</h1>
            <p style={{ color: 'var(--text-muted)' }}>Управление ассортиментом вашего магазина</p>
          </div>
          <button className="btn-neon" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Plus size={20} />
            Добавить товар
          </button>
        </div>

        {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} onSuccess={fetchProducts} />}
        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSuccess={fetchProducts} 
          />
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>
        ) : products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            {products.map(product => (
              <div key={product.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'var(--bg-side)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={product.images?.[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>{product.name}</div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>${product.price.toFixed(2)}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Запасы: {product.stock}</span>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>{product.categoryId}</span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={() => setEditingProduct(product)}
                    className="glass-card"
                    style={{ padding: '0.75rem', borderRadius: '10px', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Edit3 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="glass-card"
                    style={{ padding: '0.75rem', borderRadius: '10px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '5rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <Package size={48} style={{ opacity: 0.3, marginBottom: '1rem', display: 'block', margin: '0 auto' }} />
              У вас пока нет добавленных товаров
            </div>
            <button className="btn-neon" onClick={() => setIsModalOpen(true)}>Добавить первый товар</button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
