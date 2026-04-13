"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';

export default function SellerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      productService.getSellerProducts(user.uid)
        .then(data => {
          if (Array.isArray(data)) {
            setProducts(data);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Seller Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 3fr)', gap: '2rem' }}>
          
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Store Management</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li>
                <button className="btn-primary" style={{ width: '100%', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border)', textAlign: 'left' }}>
                  Manage Products
                </button>
              </li>
              <li>
                <button className="btn-primary" style={{ width: '100%', background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border)', textAlign: 'left' }}>
                  View Orders
                </button>
              </li>
              <li>
                <button className="btn-primary">
                  + Add New Product
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Products</h2>
            {loading ? (
              <div>Loading...</div>
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
                      <button style={{ marginRight: '1rem', color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Edit</button>
                      <button style={{ color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)' }}>
                <p style={{ color: 'var(--text-muted)' }}>You don't have any products yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
