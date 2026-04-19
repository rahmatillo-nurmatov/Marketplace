"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { orderService } from '@/lib/services/orderService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Order } from '@/types';
import { 
  ShoppingBag, CheckCircle,
  MapPin, Calendar, Package, ChevronRight, 
  User, ArrowLeft, RefreshCw, Trash2, AlertTriangle
} from 'lucide-react';

export default function SellerOrders() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user?.uid) fetchOrders(); }, [user]);

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, status: newStatus });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(t('error_occurred'));
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await orderService.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
    } catch (e) { console.error(e); }
    finally { setDeleting(null); }
  };

  const handleClearAll = async () => {
    setLoading(true);
    try {
      const delivered = orders.filter(o => o.status === 'delivered');
      await Promise.all(delivered.map(o => orderService.deleteOrder(o.id)));
      setOrders(prev => prev.filter(o => o.status !== 'delivered'));
      setSelectedOrder(null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setConfirmClearAll(false); }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return '#F59E0B'; // Amber
      case 'processing': return '#3B82F6'; // Blue
      case 'shipped': return '#8B5CF6'; // Violet
      case 'delivered': return '#10B981'; // Green
      case 'cancelled': return '#EF4444'; // Red
      default: return '#6B7280';
    }
  };

  // Strict Styles (No Gradients)
  const strictCardStyle = {
    background: '#12121e',
    border: '1px solid #2a2a3c',
    borderRadius: '8px',
    padding: '1.5rem',
    transition: 'all 0.2s'
  };

  const badgeStyle = (status: string) => ({
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    background: `${getStatusColor(status)}20`,
    color: getStatusColor(status),
    border: `1px solid ${getStatusColor(status)}40`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem'
  });

  if (selectedOrder) {
    return (
      <ProtectedRoute allowedRoles={['seller', 'admin']}>
        <div style={{ padding: '2rem 0' }}>
          <button 
            onClick={() => setSelectedOrder(null)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}
          >
            <ArrowLeft size={18} /> {t('back_to_list')}
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            {/* Order Details Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div style={strictCardStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                    <div>
                      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('order_details_title', { id: selectedOrder.id.substring(0,8) })}</h2>
                      <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14}/> {new Date(selectedOrder.createdAt).toLocaleString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Package size={14}/> {t('items_count', { count: selectedOrder.items.length })}</span>
                      </div>
                    </div>
                    <div style={badgeStyle(selectedOrder.status)}>
                       {selectedOrder.status}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #2a2a3c', paddingTop: '1.5rem' }}>
                     <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '1px' }}>{t('composition_title')}</h4>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#1a1a2b', borderRadius: '6px' }}>
                             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: '#252538', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                   <Package size={20} color="#4b4b63" />
                                </div>
                                <div>
                                   <div style={{ fontWeight: 700 }}>{item.name}</div>
                                   <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>${item.price.toFixed(2)} x {item.quantity}</div>
                                   {(item.selectedColor || item.selectedSize) && (
                                     <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                                       {item.selectedColor && (
                                         <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(138,63,252,0.12)', border: '1px solid rgba(138,63,252,0.3)', color: 'var(--primary)' }}>
                                           <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.selectedColor, border: '1px solid rgba(255,255,255,0.2)', display: 'inline-block' }} />
                                           {item.selectedColor}
                                         </span>
                                       )}
                                       {item.selectedSize && (
                                         <span style={{ padding: '2px 8px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(0,224,255,0.08)', border: '1px solid rgba(0,224,255,0.25)', color: '#00e0ff' }}>
                                           {item.selectedSize}
                                         </span>
                                       )}
                                     </div>
                                   )}
                                </div>
                             </div>
                             <div style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</div>
                          </div>
                        ))}
                     </div>
                  </div>

                  <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid #2a2a3c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{t('order_sum')}</span>
                     <span style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>${selectedOrder.total.toFixed(2)}</span>
                  </div>
               </div>

               {/* Timeline */}
               <div style={strictCardStyle}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2rem', letterSpacing: '1px' }}>{t('change_history')}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                     {[
                       { status: 'pending', label: t('order_label'), active: true },
                       { status: 'processing', label: t('in_processing'), active: ['processing', 'shipped', 'delivered'].includes(selectedOrder.status) },
                       { status: 'shipped', label: t('status_shipped'), active: ['shipped', 'delivered'].includes(selectedOrder.status) },
                       { status: 'delivered', label: t('status_delivered'), active: selectedOrder.status === 'delivered' }
                     ].map((step, idx, arr) => (
                       <div key={step.status} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '50%', 
                            background: step.active ? getStatusColor(step.status) : '#2a2a3c',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                             {step.active && <CheckCircle size={14} color="white" />}
                          </div>
                          {idx < arr.length - 1 && (
                            <div style={{ position: 'absolute', left: '11px', top: '24px', width: '2px', height: 'calc(100% + 4px)', background: step.active && arr[idx+1].active ? getStatusColor(step.status) : '#2a2a3c', zIndex: 1 }} />
                          )}
                          <div>
                             <div style={{ fontWeight: 700, color: step.active ? 'white' : 'var(--text-muted)' }}>{step.label}</div>
                             {step.active && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.status === selectedOrder.status ? t('status_current') : t('status_completed')}</div>}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Actions Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div style={strictCardStyle}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '1px' }}>{t('delivery_label')}</h4>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                     <MapPin size={20} color="var(--primary)" />
                     <div style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{selectedOrder.shippingAddress}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
                     <User size={18} />
                     <span style={{ fontSize: '0.875rem' }}>{t('client_id_label')} {selectedOrder.clientId.substring(0,12)}...</span>
                  </div>
               </div>

               <div style={strictCardStyle}>
                  <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.5rem', letterSpacing: '1px' }}>{t('status_management')}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                     {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status as any)}
                          style={{
                            padding: '0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #2a2a3c',
                            background: selectedOrder.status === status ? getStatusColor(status) : 'transparent',
                            color: selectedOrder.status === status ? 'white' : 'var(--text-muted)',
                            fontWeight: 700,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                           {status}
                           {selectedOrder.status === status && <CheckCircle size={14} />}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('sidebar_orders')}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{t('orders_management_desc')}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {orders.length > 0 && !confirmClearAll && (
              <button
                onClick={() => setConfirmClearAll(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#EF4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem', transition: 'all 0.2s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
              >
                <Trash2 size={16} /> {t('remove')} {t('sidebar_orders')}
              </button>
            )}
            {confirmClearAll && (
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '12px' }}>
                <AlertTriangle size={16} color="#EF4444" />
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{t('delete_confirm')}</span>
                <button onClick={handleClearAll} style={{ padding: '0.35rem 0.9rem', borderRadius: '8px', background: '#EF4444', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>{t('approve')}</button>
                <button onClick={() => setConfirmClearAll(false)} style={{ padding: '0.35rem 0.9rem', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', border: '1px solid var(--border)', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}>{t('cancel')}</button>
              </div>
            )}
            <button 
              onClick={fetchOrders}
              className="glass-card" 
              style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}
            >
              <RefreshCw size={18} /> {t('update_db')}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>
             <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('database_sync_msg')}</div>
          </div>
        ) : orders.length > 0 ? (
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #2a2a3c' }}>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                   <tr style={{ background: '#12121e', borderBottom: '1px solid #2a2a3c' }}>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('order_label')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('date_label')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('status')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('items_label')}</th>
                      <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('order_sum')}</th>
                      <th style={{ padding: '1.25rem 2rem' }}></th>
                      <th style={{ padding: '1.25rem 1rem' }}></th>
                   </tr>
                </thead>
                <tbody>
                   {orders.map(order => (
                     <tr key={order.id} style={{ borderBottom: '1px solid #2a2a3c', background: 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '1.25rem 2rem' }}>
                           <div style={{ fontWeight: 700 }}>#{order.id.substring(0,8)}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {order.clientId.substring(0,6)}...</div>
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                           <div style={{ fontSize: '0.875rem' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                           <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                           <span style={badgeStyle(order.status)}>{order.status}</span>
                        </td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Package size={14} color="var(--text-muted)" />
                              <span style={{ fontSize: '0.875rem' }}>{t('variation_count', { count: order.items.length })}</span>
                           </div>
                        </td>
                        <td style={{ padding: '1.25rem 2rem', fontWeight: 800 }}>${order.total.toFixed(2)}</td>
                        <td style={{ padding: '1.25rem 2rem' }}>
                           <button 
                             onClick={() => setSelectedOrder(order)}
                             className="glass-card" 
                             style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                           >
                             {t('details')} <ChevronRight size={14} />
                           </button>
                        </td>
                        <td style={{ padding: '1.25rem 1rem' }}>
                           {order.status === 'delivered' && (
                           <button
                             onClick={() => handleDelete(order.id)}
                             disabled={deleting === order.id}
                             style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', opacity: deleting === order.id ? 0.5 : 1 }}
                             onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
                             onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                             title={t('remove')}
                           >
                             <Trash2 size={15} />
                           </button>
                           )}
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', borderStyle: 'dashed' }}>
            <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '2rem', display: 'block', margin: '0 auto' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem' }}>{t('no_orders_msg')}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
