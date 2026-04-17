"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';
import { 
  ShieldCheck, Clock, CheckCircle, XCircle, 
  Package, ExternalLink, RefreshCw, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const data = await productService.getPendingProducts();
      setPendingProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await productService.updateProductStatus(id, status);
      setPendingProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(t('error_occurred'));
    }
  };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('moderation_center')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{t('moderation_desc')}</p>
          </div>
          <button 
            onClick={fetchPending}
            className="glass-card" 
            style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> {t('update_btn')}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>{t('processing')}</div>
        ) : pendingProducts.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            {pendingProducts.map(product => (
              <div key={product.id} className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: '2rem', alignItems: 'center' }}>
                <img 
                  src={product.images[0]} 
                  style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border)' }} 
                />
                
                <div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                      <Clock size={14} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>{t('waiting_review')}</span>
                   </div>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{product.name}</h3>
                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span>{t('price_label')}: ${product.price}</span>
                      <span>{t('seller_label')}: {product.sellerId.substring(0,8)}...</span>
                   </div>
                   {product.isPromoted && (
                     <div style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', background: 'rgba(0, 224, 255, 0.1)', border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-block', textTransform: 'uppercase' }}>
                        {t('promotion_title')}
                     </div>
                   )}
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                   <Link href={`/product/${product.id}`} className="glass-card" style={{ padding: '0.75rem', borderRadius: '8px', color: 'white' }}>
                      <ExternalLink size={20} />
                   </Link>
                   <button 
                     onClick={() => handleAction(product.id, 'rejected')}
                     className="glass-card" 
                     style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', color: '#EF4444', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                   >
                     <XCircle size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> {t('reject')}
                   </button>
                   <button 
                     onClick={() => handleAction(product.id, 'approved')}
                     className="btn-neon" 
                     style={{ padding: '0.75rem 1.5rem', background: '#10B981', color: 'white', borderRadius: '8px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.3)' }}
                   >
                     <CheckCircle size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} /> {t('approve')}
                   </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <ShieldCheck size={48} style={{ opacity: 0.2, marginBottom: '2rem', display: 'block', margin: '0 auto' }} />
             <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{t('no_pending_products')}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
