"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, Calendar, Hash, CreditCard, MapPin, Package, User, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import { Order } from '@/types';

export default function HistoryPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedOrder(prev => prev === id ? null : id);
  };

  const formatTime = (ms: number) => {
    const d = new Date(ms);
    return `${d.toLocaleDateString()} ${t('at')} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
  };

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-1px' }}>{t('sidebar_history')}</h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>{t('processing')}</div>
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '2rem', overflow: 'hidden', borderTop: '4px solid var(--primary)' }}>
                {/* Order Header Summary */}
                <div 
                  style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr auto', gap: '2rem', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => toggleExpand(order.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: 'rgba(138, 63, 252, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={24} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('order_label')}</p>
                      <p style={{ fontWeight: 800, fontSize: '1.125rem' }}>#{order.id.substring(0, 8)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Calendar size={18} color="var(--text-muted)" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('date_and_time')}</p>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{formatTime(order.createdAt)}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Clock size={18} color="#10B981" />
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('status')}</p>
                      <p style={{ fontWeight: 800, color: '#10B981', textTransform: 'capitalize' }}>
                        {order.status === 'pending' ? t('in_processing') : 
                         order.status === 'shipped' ? t('status_shipped') : 
                         order.status === 'delivered' ? t('status_delivered') : 
                         order.status === 'cancelled' ? t('status_cancelled') : 
                         order.status}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }}>
                     <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('total_price')}</p>
                      <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div style={{ color: 'var(--text-muted)' }}>
                    {expandedOrder === order.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div style={{ marginTop: '2.5rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', animation: 'fadeIn 0.3s ease' }}>
                    
                    {/* Meta Info (Shipping & Billing) */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                       <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                             <MapPin size={18} /> {t('shipping_address')}
                          </h4>
                          <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.5 }}>
                            {order.shippingAddress || t('no_cards')}
                          </p>
                       </div>
                       
                       <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                             <CreditCard size={18} /> {t('payment_methods')}
                          </h4>
                          <p style={{ fontSize: '1.1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {order.paymentMethod || t('secure_deal_enabled')} 
                            <span style={{ padding: '4px 8px', background: 'var(--border)', borderRadius: '6px', fontSize: '0.85rem', letterSpacing: '2px' }}>
                              •••• {order.cardLast4 || 'XXXX'}
                            </span>
                          </p>
                       </div>
                    </div>

                    {/* Order Items List */}
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', paddingLeft: '0.5rem' }}>{t('composition_title')}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ 
                          display: 'grid', 
                          gridTemplateColumns: '80px 2fr 1fr 1fr 1fr', 
                          gap: '1.5rem', 
                          alignItems: 'center', 
                          padding: '1rem', 
                          background: 'rgba(0,0,0,0.2)', 
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          {/* Item Image */}
                          <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', background: 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {item.image ? (
                              <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <ImageIcon size={24} style={{ opacity: 0.3 }} />
                            )}
                          </div>
                          
                          {/* Item Name & Details */}
                          <div>
                             <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</p>
                             <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('sku_label')} {item.productId.substring(0,8)}</p>
                             {(item.selectedColor || item.selectedSize) && (
                               <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                 {item.selectedColor && (
                                   <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(138,63,252,0.12)', border: '1px solid rgba(138,63,252,0.3)', color: 'var(--primary)' }}>
                                     <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.selectedColor, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }} />
                                     {item.selectedColor}
                                   </span>
                                 )}
                                 {item.selectedSize && (
                                   <span style={{ padding: '2px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, background: 'rgba(0,224,255,0.08)', border: '1px solid rgba(0,224,255,0.25)', color: 'var(--accent)' }}>
                                     {item.selectedSize}
                                   </span>
                                 )}
                               </div>
                             )}
                          </div>

                          {/* Seller */}
                          <div>
                             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('seller_label')}</p>
                             <p style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                               <User size={14} /> {item.sellerId || 'System'}
                             </p>
                          </div>

                          {/* Quantity */}
                          <div>
                             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('quantity')}</p>
                             <p style={{ fontWeight: 800 }}>{item.quantity} {t('pcs')}</p>
                          </div>

                          {/* Price */}
                          <div style={{ textAlign: 'right' }}>
                             <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('order_sum')}</p>
                             <p style={{ fontWeight: 800, fontSize: '1.1rem' }}>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '6rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <Package size={64} style={{ opacity: 0.2, marginBottom: '1.5rem', display: 'block', margin: '0 auto' }} />
             <p style={{ color: 'var(--text-muted)', fontSize: '1.5rem', fontWeight: 700 }}>{t('empty_history_title')}</p>
             <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('empty_history_desc')}</p>
             <button className="btn-neon" onClick={() => window.location.href = '/'}>{t('sidebar_home')}</button>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
