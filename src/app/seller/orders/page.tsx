"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { ShoppingBag, Clock, CheckCircle, Truck } from 'lucide-react';

export default function SellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      // For MVP we use a mock/simple fetch. In real app, filter orders by sellerId in items.
      setLoading(true);
      setTimeout(() => {
         setOrders([]);
         setLoading(false);
      }, 800);
    }
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      default: return <ShoppingBag size={16} />;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Заказы</h1>
          <p style={{ color: 'var(--text-muted)' }}>Просмотр и управление заказами ваших покупателей</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Загрузка...</div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>Заказ #{order.id.substring(0,8)}</div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{order.items.length} товара</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                   <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>${order.total.toFixed(2)}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                         {getStatusIcon(order.status)}
                         <span style={{ textTransform: 'uppercase', fontWeight: 700 }}>{order.status}</span>
                      </div>
                   </div>
                   <button className="btn-neon" style={{ padding: '0.6rem 1.25rem', fontSize: '0.875rem' }}>Детали</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '6rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', display: 'block', margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Список заказов пуст</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
