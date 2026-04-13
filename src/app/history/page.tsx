"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Calendar, Hash } from 'lucide-react';

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      orderService.getOrdersByClient(user.uid)
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem' }}>{t('sidebar_history')}</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>{t('processing')}</div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(138, 63, 252, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color="var(--primary)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('order_id')}</p>
                    <p style={{ fontWeight: 700 }}>#{order.id.substring(0, 8)}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={18} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('date')}</p>
                    <p style={{ fontWeight: 600 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={18} color="#10B981" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('status')}</p>
                    <p style={{ fontWeight: 700, color: '#10B981', textTransform: 'capitalize' }}>{order.status}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                   <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('total_price')}</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '6rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <Clock size={48} style={{ opacity: 0.2, marginBottom: '1.5rem', display: 'block', margin: '0 auto' }} />
             <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{t('no_orders')}</p>
             <button className="btn-neon" style={{ marginTop: '2rem' }} onClick={() => window.location.href = '/'}>{t('sidebar_home')}</button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
