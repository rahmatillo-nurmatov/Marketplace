"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

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
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        fetchProducts();
      } catch (err) {
        console.error(err);
        alert('Error deleting product');
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>{t('dashboard')}</h1>
        
        {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} onSuccess={fetchProducts} />}
        {editingProduct && (
          <EditProductModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSuccess={fetchProducts} 
          />
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 3fr)', gap: '2rem' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>{t('store_management')}</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>
                <button 
                  onClick={() => setActiveTab('products')}
                  className="btn-primary" 
                  style={{ width: '100%', background: activeTab === 'products' ? 'var(--primary)' : 'var(--bg-color)', color: activeTab === 'products' ? 'white' : 'var(--text-main)', border: '1px solid var(--border)', textAlign: 'left' }}
                >
                  {t('manage_products')}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className="btn-primary" 
                  style={{ width: '100%', background: activeTab === 'orders' ? 'var(--primary)' : 'var(--bg-color)', color: activeTab === 'orders' ? 'white' : 'var(--text-main)', border: '1px solid var(--border)', textAlign: 'left' }}
                >
                  {t('view_orders')}
                </button>
              </li>
              <li>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                  + {t('add_new_product')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
              {activeTab === 'products' ? t('your_products') : t('view_orders')}
            </h2>
            
            {activeTab === 'products' ? (
              loading ? (
                <div>{t('processing')}</div>
              ) : products.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {products.map(product => (
                  <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem 1.5rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={product.images?.[0] || 'https://via.placeholder.com/50'} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{product.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>${product.price.toFixed(2)} | Stock: {product.stock}</div>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => setEditingProduct(product)}
                        style={{ marginRight: '1rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                <p style={{ color: 'var(--text-muted)' }}>{t('no_products')}</p>
              </div>
            )) : (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                <p style={{ color: 'var(--text-muted)' }}>{t('no_orders')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
