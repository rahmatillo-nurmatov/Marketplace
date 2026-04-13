"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { Order } from '@/types';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.uid) {
      orderService.getOrdersByClient(user.uid)
        .then(data => {
          setOrders(data);
          setFilteredOrders(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  useEffect(() => {
    let filtered = [...orders];
    
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter(o => o.createdAt >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate).getTime() + 86400000; // Include the whole end day
      filtered = filtered.filter(o => o.createdAt <= end);
    }
    
    setFilteredOrders(filtered);
  }, [startDate, endDate, orders]);

  const totalSpent = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Order History & Expenses</h1>

        <div style={{ 
          background: 'var(--bg-card)', 
          padding: '2rem', 
          borderRadius: 'var(--radius)', 
          border: '1px solid var(--border)',
          marginBottom: '3rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>From Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>To Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.6rem', borderRadius: '8px' }}
            />
          </div>
          <div style={{ flexGrow: 1, textAlign: 'right' }}>
            <div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>Total Expenses in Period:</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${totalSpent.toFixed(2)}</div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem' }}>Loading your history...</div>
        ) : filteredOrders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredOrders.map(order => (
              <div key={order.id} style={{ 
                background: 'var(--bg-card)', 
                padding: '1.5rem', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '2rem'
              }}>
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ fontWeight: 600 }}>Order ID: {order.id.slice(0, 8)}...</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>${order.total.toFixed(2)}</div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-color)', 
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    textTransform: 'capitalize'
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '6rem', 
            background: 'var(--bg-card)', 
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>No orders found for this period</h3>
            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your date range or start shopping!</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
