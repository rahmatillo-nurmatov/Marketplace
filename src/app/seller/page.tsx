"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';
import { 
  Plus, Search, Filter, Package, 
  DollarSign, TrendingUp, Edit3, Trash2,
  Calendar, Zap, AlertCircle, CheckCircle, X
} from 'lucide-react';
import { AddProductModal } from '@/components/AddProductModal';
import { EditProductModal } from '@/components/EditProductModal';

export default function SellerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Promotion State
  const [promoteProduct, setPromoteProduct] = useState<Product | null>(null);
  const [adDates, setAdDates] = useState({ start: '', end: '' });
  const [promoSubmitting, setPromoSubmitting] = useState(false);

  const fetchProducts = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const data = await productService.getSellerProducts(user.uid);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleDelete = async (id: string) => {
    if (!confirm(t('delete_confirm'))) return;
    try {
      await productService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyPromo = async () => {
    if (!promoteProduct || !adDates.start || !adDates.end) return;
    setPromoSubmitting(true);
    try {
      const start = new Date(adDates.start).getTime();
      const end = new Date(adDates.end).getTime();
      await productService.purchasePromotion(promoteProduct.id, start, end);
      alert(t('promo_sent_notice'));
      setPromoteProduct(null);
      fetchProducts();
    } catch (err) {
      alert(t('promo_error'));
    } finally {
      setPromoSubmitting(false);
    }
  };

  const calculatePromoPrice = () => {
    if (!adDates.start || !adDates.end) return 0;
    const s = new Date(adDates.start);
    const e = new Date(adDates.end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff) * 100;
  };

  const stats = {
    total: products.length,
    stockValue: products.reduce((acc, p) => acc + (p.price * p.stock), 0),
    categories: new Set(products.map(p => p.categoryId)).size
  };

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'approved': return { label: t('status_active'), color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' };
      case 'rejected': return { label: t('status_rejected'), color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' };
      default: return { label: t('status_waiting'), color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' };
    }
  };

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        {/* Header and Stats rows... same as before but optimized */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('manage_products')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{t('welcome_seller')}</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-neon" 
            style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
          >
            <Plus size={20} /> {t('add_new_product')}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
           <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(138, 63, 252, 0.1)', borderRadius: '16px' }}>
                 <Package size={24} color="var(--primary)" />
              </div>
              <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('total_products')}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stats.total}</div>
              </div>
           </div>
           <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(0, 224, 255, 0.1)', borderRadius: '16px' }}>
                 <TrendingUp size={24} color="var(--accent)" />
              </div>
              <div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('total_value')}</div>
                 <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>${stats.stockValue.toLocaleString()}</div>
              </div>
           </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>{t('processing')}</div>
        ) : (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                   <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t('product_info')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t('status')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t('price_stock')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{t('actions')}</th>
                   </tr>
                </thead>
                <tbody>
                   {products.map(p => {
                     const status = getStatusBadge(p.status);
                     return (
                       <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <img src={p.images[0]} style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div>
                                   <div style={{ fontWeight: 700 }}>{p.name}</div>
                                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.categoryId}</div>
                                </div>
                             </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <span style={{ padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, color: status.color, background: status.bg, border: `1px solid ${status.color}30` }}>
                                {status.label}
                             </span>
                             {p.isPromoted && (
                               <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'uppercase' }}>
                                  <Zap size={10} fill="var(--accent)" /> {t('ad_active')}
                               </div>
                             )}
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ fontWeight: 800 }}>${p.price}</div>
                             <div style={{ fontSize: '0.75rem', color: p.stock < 10 ? '#EF4444' : 'var(--text-muted)' }}>
                                {t('in_stock_msg', { count: p.stock })}
                             </div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ display: 'flex', gap: '1rem' }}>
                                <button 
                                  onClick={() => setPromoteProduct(p)}
                                  className="glass-card" 
                                  style={{ padding: '0.5rem', color: 'var(--accent)' }}
                                  title={t('order_ad')}
                                >
                                   <Zap size={18} fill={p.isPromoted ? 'currentColor' : 'none'} />
                                </button>
                                <button onClick={() => setEditProduct(p)} className="glass-card" style={{ padding: '0.5rem', color: 'var(--primary)' }}><Edit3 size={18} /></button>
                                <button onClick={() => handleDelete(p.id)} className="glass-card" style={{ padding: '0.5rem', color: '#EF4444' }}><Trash2 size={18} /></button>
                             </div>
                          </td>
                       </tr>
                     );
                   })}
                </tbody>
             </table>
          </div>
        )}

        {/* Promotion Modal Overlay */}
        {promoteProduct && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ width: '500px', padding: '3rem', position: 'relative' }}>
               <button onClick={() => setPromoteProduct(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
               
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ width: '50px', height: '50px', background: 'rgba(0, 224, 255, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <Zap size={24} color="var(--accent)" fill="var(--accent)" />
                  </div>
                  <div>
                     <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{t('promotion_title')}</h2>
                     <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{t('promotion_desc')}</p>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)' }}>{t('select_period')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                     <div>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{t('start_date')}</span>
                        <input type="date" value={adDates.start} onChange={(e) => setAdDates({ ...adDates, start: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
                     </div>
                     <div>
                        <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>{t('end_date')}</span>
                        <input type="date" value={adDates.end} onChange={(e) => setAdDates({ ...adDates, end: e.target.value })} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white', outline: 'none' }} />
                     </div>
                  </div>
               </div>

               <div style={{ padding: '1.5rem', background: 'rgba(0, 224, 255, 0.05)', borderRadius: '12px', border: '1px solid var(--accent)30', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>{t('daily_rate')}</span>
                     <span>$100.00 / day</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900 }}>
                     <span>{t('total_to_pay')}</span>
                     <span style={{ color: 'var(--accent)' }}>${calculatePromoPrice()}</span>
                  </div>
               </div>

               <button 
                 disabled={calculatePromoPrice() <= 0 || promoSubmitting}
                 onClick={handleApplyPromo}
                 className="btn-neon" 
                 style={{ width: '100%', padding: '1rem', background: 'var(--accent)', boxShadow: '0 0 20px rgba(0, 224, 255, 0.4)' }}
               >
                  {promoSubmitting ? t('processing') : t('confirm_and_buy')}
               </button>
            </div>
          </div>
        )}

        {isAddModalOpen && (
          <AddProductModal 
            onClose={() => setIsAddModalOpen(false)} 
            onSuccess={fetchProducts} 
          />
        )}
        
        {editProduct && (
          <EditProductModal 
            product={editProduct} 
            onClose={() => setEditProduct(null)} 
            onSuccess={fetchProducts} 
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
