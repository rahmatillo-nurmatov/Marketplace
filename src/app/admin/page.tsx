"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });

  useEffect(() => {
    // In production we would fetch stats from an API
    setTimeout(() => {
      setStats({ users: 120, products: 45, orders: 320 });
    }, 1000);
  }, []);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="container" style={{ padding: '4rem 0' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Admin Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Users</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.users}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Products</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.products}</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Orders</div>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)' }}>{stats.orders}</div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" style={{ width: 'auto' }}>Manage Users</button>
          <button className="btn-primary" style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Review Products</button>
          <button className="btn-primary" style={{ width: 'auto', background: 'var(--bg-card)', color: 'var(--text-main)', border: '1px solid var(--border)' }}>Platform Settings</button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
