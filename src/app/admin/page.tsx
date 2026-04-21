"use client";
import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { adminService, AdminUser, PlatformSettings } from '@/lib/services/adminService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product, Order } from '@/types';
import Link from 'next/link';
import {
  Users, Package, ShoppingBag, Star, Settings, BarChart2,
  RefreshCw, CheckCircle, XCircle, Trash2, Ban, UserCheck,
  ChevronDown, ChevronUp, ExternalLink, Download,
  TrendingUp, DollarSign, AlertTriangle, Gavel, Save, Eye, EyeOff
} from 'lucide-react';

type T = (key: any, vars?: any) => string;

const card: React.CSSProperties = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const statCard = (c: string): React.CSSProperties => ({ ...card, borderLeft: `3px solid ${c}` });
const badge = (c: string): React.CSSProperties => ({ padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, background: `${c}20`, color: c, border: `1px solid ${c}40`, display: 'inline-block' });
const btn = (c = 'var(--primary)', ghost = false): React.CSSProperties => ({ padding: '0.5rem 1.1rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: ghost ? `${c}15` : c, color: ghost ? c : 'white', border: `1px solid ${ghost ? c + '50' : 'transparent'}`, transition: 'all 0.2s' });

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('dashboard');
  const TABS = [
    { id: 'dashboard', label: t('tab_dashboard'), icon: BarChart2 },
    { id: 'users',     label: t('tab_users'),     icon: Users },
    { id: 'catalog',   label: t('tab_catalog'),   icon: Package },
    { id: 'orders',    label: t('tab_orders'),    icon: ShoppingBag },
    { id: 'reviews',   label: t('tab_reviews'),   icon: Star },
    { id: 'disputes',  label: t('tab_disputes'),  icon: Gavel },
    { id: 'settings',  label: t('tab_settings'),  icon: Settings },
  ];
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ padding: '1.5rem 0' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.25rem' }}>{t('admin_panel_title')}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('admin_panel_desc')}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', background: tab === id ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: tab === id ? 'white' : 'var(--text-muted)', border: tab === id ? '1px solid var(--primary)' : '1px solid var(--border)', transition: 'all 0.2s' }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
        {tab === 'dashboard' && <TabDashboard t={t} />}
        {tab === 'users'     && <TabUsers t={t} />}
        {tab === 'catalog'   && <TabCatalog t={t} />}
        {tab === 'orders'    && <TabOrders t={t} />}
        {tab === 'reviews'   && <TabReviews t={t} />}
        {tab === 'disputes'  && <TabDisputes t={t} />}
        {tab === 'settings'  && <TabSettings t={t} />}
      </div>
    </ProtectedRoute>
  );
}

function TabDashboard({ t }: { t: T }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { adminService.getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  const kpis = [
    { label: t('kpi_gmv'),       value: `$${data.gmv.toFixed(0)}`,        icon: TrendingUp,  color: '#8a3ffc' },
    { label: t('kpi_commission'), value: `$${data.commission.toFixed(0)}`, icon: DollarSign,  color: '#10B981' },
    { label: t('tab_orders'),     value: data.totalOrders,                 icon: ShoppingBag, color: '#F59E0B' },
    { label: t('tab_users'),      value: data.totalUsers,                  icon: Users,       color: '#00e0ff' },
    { label: t('kpi_sellers'),    value: data.sellers,                     icon: UserCheck,   color: '#8a3ffc' },
    { label: t('kpi_buyers'),     value: data.buyers,                      icon: Users,       color: '#10B981' },
    { label: t('tab_catalog'),    value: data.totalProducts,               icon: Package,     color: '#F59E0B' },
    { label: t('tab_reviews'),    value: data.totalReviews,                icon: Star,        color: '#EF4444' },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
        {kpis.map(k => (
          <div key={k.label} style={statCard(k.color)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{k.label}</span>
              <k.icon size={18} color={k.color} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800 }}>{t('monthly_gmv')}</h3>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(data.monthlyGmv, 'gmv.csv')}><Download size={14} /> {t('export_csv')}</button>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', height: '120px' }}>
          {data.monthlyGmv.map((m: any) => {
            const max = Math.max(...data.monthlyGmv.map((x: any) => x.total), 1);
            const h = Math.max((m.total / max) * 100, 4);
            return (
              <div key={m.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>${m.total.toFixed(0)}</span>
                <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(to top, var(--primary), var(--accent))', borderRadius: '6px 6px 0 0', minHeight: '4px' }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 800 }}>{t('top_products_revenue')}</h3>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(data.topProducts, 'top-products.csv')}><Download size={14} /> {t('export_csv')}</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.topProducts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>{t('no_data_yet')}</p>}
          {data.topProducts.map((p: any, i: number) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.count} {t('sold')}</span>
              <span style={{ color: '#10B981', fontWeight: 800 }}>${p.revenue.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TabUsers({ t }: { t: T }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'client'|'seller'|'admin'>('all');
  const [search, setSearch] = useState('');
  const load = () => { setLoading(true); adminService.getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleRole = async (uid: string, role: AdminUser['role']) => { await adminService.updateUserRole(uid, role); setUsers(p => p.map(u => u.uid === uid ? { ...u, role } : u)); };
  const handleBlock = async (uid: string, blocked: boolean) => { await adminService.blockUser(uid, blocked); setUsers(p => p.map(u => u.uid === uid ? { ...u, blocked } : u)); };
  const handleDelete = async (uid: string) => { if (!confirm(t('delete_user_confirm'))) return; await adminService.deleteUser(uid); setUsers(p => p.filter(u => u.uid !== uid)); };
  const roleColor = (r: string) => r === 'admin' ? '#8a3ffc' : r === 'seller' ? '#F59E0B' : '#10B981';
  const visible = users.filter(u => (filter === 'all' || u.role === filter) && (!search || u.email?.includes(search) || u.displayName?.toLowerCase().includes(search.toLowerCase())));
  if (loading) return <Loader />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('search_user')}
          style={{ flex: 1, minWidth: '200px', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', outline: 'none' }} />
        {(['all','client','seller','admin'] as const).map(r => (
          <button key={r} onClick={() => setFilter(r)} style={btn(r === 'all' ? 'var(--primary)' : roleColor(r), filter !== r)}>
            {r === 'all' ? t('all_categories') : r}
          </button>
        ))}
        <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(visible.map(u => ({ uid: u.uid, email: u.email, role: u.role, blocked: u.blocked })), 'users.csv')}><Download size={14} /> CSV</button>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              {[t('col_user'), t('col_role'), t('col_status'), t('col_joined'), t('col_actions')].map(h => (
                <th key={h} style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(u => (
              <tr key={u.uid} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', opacity: u.blocked ? 0.5 : 1 }}>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.displayName || '—'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>{u.uid.substring(0,12)}…</div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <select value={u.role} onChange={e => handleRole(u.uid, e.target.value as AdminUser['role'])}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: '8px', color: roleColor(u.role), padding: '0.3rem 0.6rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                    <option value="client">client</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}><span style={badge(u.blocked ? '#EF4444' : '#10B981')}>{u.blocked ? t('status_blocked') : t('status_active_user')}</span></td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={btn(u.blocked ? '#10B981' : '#F59E0B', true)} onClick={() => handleBlock(u.uid, !u.blocked)}>
                      {u.blocked ? <UserCheck size={13} /> : <Ban size={13} />} {u.blocked ? t('btn_unblock') : t('btn_block')}
                    </button>
                    <button style={btn('#EF4444', true)} onClick={() => handleDelete(u.uid)}><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('no_users')}</p>}
      </div>
    </div>
  );
}

function TabCatalog({ t }: { t: T }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all'|'pending'|'approved'|'rejected'>('pending');
  const statusColor = (s: string) => s === 'approved' ? '#10B981' : s === 'rejected' ? '#EF4444' : '#F59E0B';
  const statusLabel = (s: string) => s === 'approved' ? t('approved') : s === 'rejected' ? t('status_rejected') : t('status_waiting');

  const load = async () => {
    setLoading(true);
    try {
      const { getDocs, collection, query, where } = await import('firebase/firestore');
      const { db } = await import('@/lib/firebase/firebase');
      const snap = filter === 'all'
        ? await getDocs(collection(db, 'products'))
        : await getDocs(query(collection(db, 'products'), where('status', '==', filter)));
      setProducts(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filter]);

  const handle = async (id: string, status: 'approved'|'rejected') => { await productService.updateProductStatus(id, status); setProducts(p => p.filter(x => x.id !== id)); };
  const handleDelete = async (id: string) => { if (!confirm(t('delete_product_confirm'))) return; await productService.deleteProduct(id); setProducts(p => p.filter(x => x.id !== id)); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['pending','approved','rejected','all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={btn(statusColor(f === 'all' ? 'approved' : f), filter !== f)}>
            {f === 'all' ? t('all_categories') : statusLabel(f)}
          </button>
        ))}
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>
      {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>{t('no_products_admin')}</p>}
          {products.map(p => (
            <div key={p.id} style={{ ...card, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              <img src={p.images?.[0]} alt="" style={{ width: 80, height: 80, borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} />
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800 }}>{p.name}</span>
                  <span style={badge(statusColor(p.status))}>{statusLabel(p.status)}</span>
                  {p.isPromoted && <span style={badge('#00e0ff')}>{t('promoted')}</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ${p.price} · {t('stock_label')}: {p.stock} · {t('seller_label')} {p.sellerId?.substring(0,8)}…
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Link href={`/product/${p.id}`} style={btn('var(--primary)', true)}><ExternalLink size={13} /></Link>
                {p.status !== 'approved' && <button style={btn('#10B981', true)} onClick={() => handle(p.id, 'approved')}><CheckCircle size={13} /> {t('btn_approve')}</button>}
                {p.status !== 'rejected' && <button style={btn('#F59E0B', true)} onClick={() => handle(p.id, 'rejected')}><XCircle size={13} /> {t('btn_reject')}</button>}
                <button style={btn('#EF4444', true)} onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabOrders({ t }: { t: T }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string|null>(null);
  const load = () => { setLoading(true); orderService.getAllOrders().then(setOrders).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleRefund = async (id: string) => {
    if (!confirm(t('refund_confirm'))) return;
    await adminService.refundOrder(id);
    setOrders(p => p.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
  };
  const statusColor = (s: string) => ({ pending:'#F59E0B', processing:'#3B82F6', shipped:'#8B5CF6', delivered:'#10B981', cancelled:'#EF4444', paid:'#00e0ff' }[s] || '#6B7280');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('total_orders_count', { count: orders.length })}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(orders.map(o => ({ id: o.id, status: o.status, total: o.total, client: o.clientId, date: new Date(o.createdAt).toLocaleDateString() })), 'orders.csv')}>
            <Download size={14} /> {t('export_csv')}
          </button>
          <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>
      {loading ? <Loader /> : (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                {[t('col_order'), t('col_client'), t('col_status'), t('col_total'), t('col_date'), t('col_actions')].map(h => (
                  <th key={h} style={{ padding: '0.9rem 1.1rem', textAlign: 'left', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <React.Fragment key={o.id}>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }} onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                    <td style={{ padding: '0.9rem 1.1rem', fontWeight: 700 }}>#{o.id.substring(0,8)}</td>
                    <td style={{ padding: '0.9rem 1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.clientId.substring(0,10)}…</td>
                    <td style={{ padding: '0.9rem 1.1rem' }}><span style={badge(statusColor(o.status))}>{o.status}</span></td>
                    <td style={{ padding: '0.9rem 1.1rem', fontWeight: 800, color: '#10B981' }}>${o.total.toFixed(2)}</td>
                    <td style={{ padding: '0.9rem 1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '0.9rem 1.1rem' }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        {o.status !== 'cancelled' && (
                          <button style={btn('#EF4444', true)} onClick={e => { e.stopPropagation(); handleRefund(o.id); }}>
                            <AlertTriangle size={12} /> {t('btn_refund')}
                          </button>
                        )}
                        {expanded === o.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr>
                      <td colSpan={6} style={{ padding: '0 1.1rem 1rem', background: 'rgba(255,255,255,0.01)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem' }}>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>📍 {o.shippingAddress}</div>
                          {o.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                              {item.image && <img src={item.image} alt="" style={{ width: 36, height: 36, borderRadius: '6px', objectFit: 'cover' }} />}
                              <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 600 }}>{item.name}</span>
                              {item.selectedColor && <span style={badge('#8a3ffc')}>{item.selectedColor}</span>}
                              {item.selectedSize && <span style={badge('#00e0ff')}>{item.selectedSize}</span>}
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>×{item.quantity}</span>
                              <span style={{ fontWeight: 800 }}>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('no_orders_admin')}</p>}
        </div>
      )}
    </div>
  );
}

function TabReviews({ t }: { t: T }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); adminService.getAllReviews().then(setReviews).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleDelete = async (id: string) => { if (!confirm(t('delete_review_confirm'))) return; await adminService.deleteReview(id); setReviews(p => p.filter(r => r.id !== id)); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('reviews_count', { count: reviews.length })}</span>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>
      {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>{t('no_reviews_admin')}</p>}
          {reviews.map(r => (
            <div key={r.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.clientId?.substring(0,10)}…</span>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />)}
                  </div>
                </div>
                <button style={btn('#EF4444', true)} onClick={() => handleDelete(r.id)}><Trash2 size={12} /> {t('btn_delete')}</button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{r.comment}</p>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{t('col_product')}: {r.productId?.substring(0,8)}… · {new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabDisputes({ t }: { t: T }) {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [resolution, setResolution] = useState('');
  const load = () => { setLoading(true); adminService.getDisputes().then(setDisputes).catch(console.error).finally(() => setLoading(false)); };
  useEffect(load, []);
  const handleResolve = async (refund: boolean) => {
    if (!selected || !resolution.trim()) return;
    await adminService.resolveDispute(selected.id, resolution, refund, selected.orderId);
    setDisputes(p => p.filter(d => d.id !== selected.id)); setSelected(null); setResolution('');
  };
  const handleReject = async () => {
    if (!selected || !resolution.trim()) return;
    await adminService.rejectDispute(selected.id, resolution);
    setDisputes(p => p.filter(d => d.id !== selected.id)); setSelected(null); setResolution('');
  };
  const dColor = (s: string) => s === 'open' ? '#F59E0B' : s === 'resolved' ? '#10B981' : '#EF4444';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('open_disputes_count', { count: disputes.filter(d => d.status === 'open').length })}</span>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>
      {loading ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {disputes.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>{t('no_disputes')}</p>}
            {disputes.map(d => (
              <div key={d.id} style={{ ...card, cursor: 'pointer', border: selected?.id === d.id ? '1px solid var(--primary)' : undefined }} onClick={() => setSelected(d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t('dispute_title', { id: d.id.substring(0,8) })}</span>
                  <span style={badge(dColor(d.status))}>{d.status}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{d.reason}</p>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>{t('col_order')}: {d.orderId?.substring(0,8)}… · {new Date(d.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
          {selected && (
            <div style={card}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Gavel size={18} /> {t('resolve_dispute')}</h3>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{t('col_reason')}:</div>
                <p style={{ fontSize: '0.9rem' }}>{selected.reason}</p>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>{t('col_order')}: {selected.orderId} · {t('col_client')}: {selected.clientId?.substring(0,10)}…</div>
              </div>
              <textarea value={resolution} onChange={e => setResolution(e.target.value)} placeholder={t('resolution_placeholder')}
                style={{ width: '100%', minHeight: '100px', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'none', outline: 'none', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button style={btn('#10B981')} onClick={() => handleResolve(true)}><CheckCircle size={14} /> {t('resolve_refund')}</button>
                <button style={btn('#3B82F6')} onClick={() => handleResolve(false)}><CheckCircle size={14} /> {t('resolve_no_refund')}</button>
                <button style={btn('#EF4444', true)} onClick={handleReject}><XCircle size={14} /> {t('btn_reject')}</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabSettings({ t }: { t: T }) {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showStripe, setShowStripe] = useState(false);
  useEffect(() => { adminService.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false)); }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try { await adminService.saveSettings(settings); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    catch (e) { console.error(e); }
    finally { setSaving(false); }
  };
  const set = (key: keyof PlatformSettings, val: any) => setSettings(prev => prev ? { ...prev, [key]: val } : null);

  if (loading || !settings) return <Loader />;

  const inp: React.CSSProperties = { padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', outline: 'none', width: '100%' };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={card}>
      <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
    </div>
  );
  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem', alignItems: 'center' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <Section title={t('settings_identity')}>
        <Field label={t('platform_name')}><input style={inp} value={settings.platformName} onChange={e => set('platformName', e.target.value)} /></Field>
        <Field label={t('logo_url')}><input style={inp} value={settings.logoUrl} onChange={e => set('logoUrl', e.target.value)} /></Field>
        <Field label={t('primary_color')}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)} style={{ width: '48px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', background: 'none' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{settings.primaryColor}</span>
          </div>
        </Field>
      </Section>
      <Section title={t('settings_financial')}>
        <Field label={t('commission_rate')}><input type="number" style={inp} value={settings.commissionRate} onChange={e => set('commissionRate', parseFloat(e.target.value))} /></Field>
        <Field label={t('seller_subscription')}><input type="number" style={inp} value={settings.sellerSubscriptionFee} onChange={e => set('sellerSubscriptionFee', parseFloat(e.target.value))} /></Field>
      </Section>
      <Section title={t('settings_integrations')}>
        <Field label={t('stripe_key')}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type={showStripe ? 'text' : 'password'} style={{ ...inp, flex: 1 }} value={settings.stripeKey} onChange={e => set('stripeKey', e.target.value)} />
            <button style={btn('var(--primary)', true)} onClick={() => setShowStripe(v => !v)}>{showStripe ? <EyeOff size={14} /> : <Eye size={14} />}</button>
          </div>
        </Field>
        <Field label={t('smtp_host')}><input style={inp} value={settings.smtpHost} onChange={e => set('smtpHost', e.target.value)} /></Field>
      </Section>
      <Section title={t('settings_legal')}>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('terms_conditions')}</label>
          <textarea value={settings.termsText} onChange={e => set('termsText', e.target.value)} rows={5} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'vertical', outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>{t('privacy_policy')}</label>
          <textarea value={settings.privacyText} onChange={e => set('privacyText', e.target.value)} rows={5} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'vertical', outline: 'none' }} />
        </div>
      </Section>
      <button onClick={handleSave} disabled={saving} style={{ ...btn(saved ? '#10B981' : 'var(--primary)'), padding: '0.85rem 2rem', fontSize: '0.95rem', alignSelf: 'flex-start', boxShadow: saved ? '0 0 20px rgba(16,185,129,0.3)' : '0 0 20px var(--primary-glow)' }}>
        {saving ? <RefreshCw size={16} /> : <Save size={16} />}
        {saved ? t('saved') : saving ? t('saving') : t('save_settings')}
      </button>
    </div>
  );
}

function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}
