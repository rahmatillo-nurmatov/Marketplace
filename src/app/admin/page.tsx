"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { productService } from '@/lib/services/productService';
import { orderService } from '@/lib/services/orderService';
import { reviewService } from '@/lib/services/reviewService';
import { adminService, AdminUser, PlatformSettings } from '@/lib/services/adminService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product, Order } from '@/types';
import Link from 'next/link';
import {
  ShieldCheck, Users, Package, ShoppingBag, Star, Settings,
  BarChart2, RefreshCw, CheckCircle, XCircle, Clock, Trash2,
  Ban, UserCheck, ChevronDown, ChevronUp, ExternalLink,
  Download, TrendingUp, DollarSign, AlertTriangle, MessageSquare,
  Gavel, Sliders, Save, Eye, EyeOff
} from 'lucide-react';

// ── Shared styles ──────────────────────────────────────────────────────────
const card = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
};

const statCard = (color: string) => ({
  ...card,
  borderLeft: `3px solid ${color}`,
});

const badge = (color: string) => ({
  padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700,
  background: `${color}20`, color, border: `1px solid ${color}40`,
  display: 'inline-block',
});

const btn = (color = 'var(--primary)', ghost = false) => ({
  padding: '0.5rem 1.1rem', borderRadius: '10px', fontWeight: 700, cursor: 'pointer',
  fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  background: ghost ? `${color}15` : color,
  color: ghost ? color : 'white',
  border: `1px solid ${ghost ? color + '50' : 'transparent'}`,
  transition: 'all 0.2s',
});

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'users',     label: 'Users',     icon: Users },
  { id: 'catalog',   label: 'Catalog',   icon: Package },
  { id: 'orders',    label: 'Orders',    icon: ShoppingBag },
  { id: 'reviews',   label: 'Reviews',   icon: Star },
  { id: 'disputes',  label: 'Disputes',  icon: Gavel },
  { id: 'settings',  label: 'Settings',  icon: Settings },
];

// ── Main component ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('dashboard');

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ padding: '1.5rem 0', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '0.25rem' }}>
            Admin Panel
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Full platform control</p>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '4px' }} className="hide-scrollbar">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: '0.6rem 1.2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer',
              fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap',
              background: tab === id ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
              color: tab === id ? 'white' : 'var(--text-muted)',
              border: tab === id ? '1px solid var(--primary)' : '1px solid var(--border)',
              transition: 'all 0.2s',
            }}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'dashboard' && <TabDashboard />}
        {tab === 'users'     && <TabUsers />}
        {tab === 'catalog'   && <TabCatalog t={t} />}
        {tab === 'orders'    && <TabOrders />}
        {tab === 'reviews'   && <TabReviews />}
        {tab === 'disputes'  && <TabDisputes />}
        {tab === 'settings'  && <TabSettings />}
      </div>
    </ProtectedRoute>
  );
}

// ── Tab: Dashboard ─────────────────────────────────────────────────────────
function TabDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const kpis = [
    { label: 'GMV', value: `$${data.gmv.toFixed(0)}`, icon: TrendingUp, color: '#8a3ffc' },
    { label: 'Commission', value: `$${data.commission.toFixed(0)}`, icon: DollarSign, color: '#10B981' },
    { label: 'Orders', value: data.totalOrders, icon: ShoppingBag, color: '#F59E0B' },
    { label: 'Users', value: data.totalUsers, icon: Users, color: '#00e0ff' },
    { label: 'Sellers', value: data.sellers, icon: UserCheck, color: '#8a3ffc' },
    { label: 'Buyers', value: data.buyers, icon: Users, color: '#10B981' },
    { label: 'Products', value: data.totalProducts, icon: Package, color: '#F59E0B' },
    { label: 'Reviews', value: data.totalReviews, icon: Star, color: '#EF4444' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* KPI grid */}
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

      {/* Monthly GMV chart (CSS bars) */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontWeight: 800 }}>Monthly GMV</h3>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(data.monthlyGmv, 'gmv.csv')}>
            <Download size={14} /> Export CSV
          </button>
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

      {/* Top products */}
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontWeight: 800 }}>Top Products by Revenue</h3>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(data.topProducts, 'top-products.csv')}>
            <Download size={14} /> Export
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.topProducts.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No data yet</p>}
          {data.topProducts.map((p: any, i: number) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{p.name}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.count} sold</span>
              <span style={{ color: '#10B981', fontWeight: 800 }}>${p.revenue.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab: Users ─────────────────────────────────────────────────────────────
function TabUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'client' | 'seller' | 'admin'>('all');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    adminService.getAllUsers().then(setUsers).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRole = async (uid: string, role: AdminUser['role']) => {
    await adminService.updateUserRole(uid, role);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
  };

  const handleBlock = async (uid: string, blocked: boolean) => {
    await adminService.blockUser(uid, blocked);
    setUsers(prev => prev.map(u => u.uid === uid ? { ...u, blocked } : u));
  };

  const handleDelete = async (uid: string) => {
    if (!confirm('Delete this user permanently?')) return;
    await adminService.deleteUser(uid);
    setUsers(prev => prev.filter(u => u.uid !== uid));
  };

  const roleColor = (r: string) => r === 'admin' ? '#8a3ffc' : r === 'seller' ? '#F59E0B' : '#10B981';

  const visible = users.filter(u =>
    (filter === 'all' || u.role === filter) &&
    (!search || u.email?.includes(search) || u.displayName?.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <Loader />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or name…"
          style={{ flex: 1, minWidth: '200px', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', outline: 'none' }} />
        {(['all','client','seller','admin'] as const).map(r => (
          <button key={r} onClick={() => setFilter(r)} style={{
            ...btn(r === 'all' ? 'var(--primary)' : roleColor(r), filter !== r),
          }}>{r}</button>
        ))}
        <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(visible.map(u => ({ uid: u.uid, email: u.email, role: u.role, blocked: u.blocked })), 'users.csv')}>
          <Download size={14} /> CSV
        </button>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
              {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
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
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)' }}>{u.uid.substring(0, 12)}…</div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <select value={u.role} onChange={e => handleRole(u.uid, e.target.value as AdminUser['role'])}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', borderRadius: '8px', color: roleColor(u.role), padding: '0.3rem 0.6rem', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                    <option value="client">client</option>
                    <option value="seller">seller</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span style={badge(u.blocked ? '#EF4444' : '#10B981')}>{u.blocked ? 'Blocked' : 'Active'}</span>
                </td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={btn(u.blocked ? '#10B981' : '#F59E0B', true)} onClick={() => handleBlock(u.uid, !u.blocked)}>
                      {u.blocked ? <UserCheck size={13} /> : <Ban size={13} />}
                      {u.blocked ? 'Unblock' : 'Block'}
                    </button>
                    <button style={btn('#EF4444', true)} onClick={() => handleDelete(u.uid)}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found</p>}
      </div>
    </div>
  );
}

// ── Tab: Catalog ───────────────────────────────────────────────────────────
function TabCatalog({ t }: { t: any }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const load = async () => {
    setLoading(true);
    try {
      const snap = await import('firebase/firestore').then(({ getDocs, collection, query, where }) => {
        const { db } = require('@/lib/firebase/firebase');
        if (filter === 'all') return getDocs(collection(db, 'products'));
        return getDocs(query(collection(db, 'products'), where('status', '==', filter)));
      });
      setProducts(snap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [filter]);

  const handle = async (id: string, status: 'approved' | 'rejected') => {
    await productService.updateProductStatus(id, status);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete product permanently?')) return;
    await productService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const statusColor = (s: string) => s === 'approved' ? '#10B981' : s === 'rejected' ? '#EF4444' : '#F59E0B';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {(['pending','approved','rejected','all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={btn(statusColor(f === 'all' ? 'approved' : f), filter !== f)}>
            {f}
          </button>
        ))}
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>

      {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {products.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>No products</p>}
          {products.map(p => (
            <div key={p.id} style={{ ...card, display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
              <img src={p.images?.[0]} alt="" style={{ width: 80, height: 80, borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }} />
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800 }}>{p.name}</span>
                  <span style={badge(statusColor(p.status))}>{p.status}</span>
                  {p.isPromoted && <span style={badge('#00e0ff')}>Promoted</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ${p.price} · Stock: {p.stock} · Seller: {p.sellerId?.substring(0,8)}…
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                <Link href={`/product/${p.id}`} style={btn('var(--primary)', true)}><ExternalLink size={13} /></Link>
                {p.status !== 'approved' && (
                  <button style={btn('#10B981', true)} onClick={() => handle(p.id, 'approved')}><CheckCircle size={13} /> Approve</button>
                )}
                {p.status !== 'rejected' && (
                  <button style={btn('#F59E0B', true)} onClick={() => handle(p.id, 'rejected')}><XCircle size={13} /> Reject</button>
                )}
                <button style={btn('#EF4444', true)} onClick={() => handleDelete(p.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Orders ────────────────────────────────────────────────────────────
function TabOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    orderService.getAllOrders().then(setOrders).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleRefund = async (id: string) => {
    if (!confirm('Refund and cancel this order?')) return;
    await adminService.refundOrder(id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
  };

  const statusColor = (s: string) => ({ pending:'#F59E0B', processing:'#3B82F6', shipped:'#8B5CF6', delivered:'#10B981', cancelled:'#EF4444', paid:'#00e0ff' }[s] || '#6B7280');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{orders.length} total orders</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={btn('#10B981', true)} onClick={() => adminService.exportCsv(orders.map(o => ({ id: o.id, status: o.status, total: o.total, client: o.clientId, date: new Date(o.createdAt).toLocaleDateString() })), 'orders.csv')}>
            <Download size={14} /> CSV
          </button>
          <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
        </div>
      </div>

      {loading ? <Loader /> : (
        <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border)' }}>
                {['Order', 'Client', 'Status', 'Total', 'Date', 'Actions'].map(h => (
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
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {o.status !== 'cancelled' && (
                          <button style={btn('#EF4444', true)} onClick={e => { e.stopPropagation(); handleRefund(o.id); }}>
                            <AlertTriangle size={12} /> Refund
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
          {orders.length === 0 && <p style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>No orders</p>}
        </div>
      )}
    </div>
  );
}

// ── Tab: Reviews ───────────────────────────────────────────────────────────
function TabReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminService.getAllReviews().then(setReviews).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await adminService.deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{reviews.length} reviews</span>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>

      {loading ? <Loader /> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reviews.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>No reviews</p>}
          {reviews.map(r => (
            <div key={r.id} style={card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{r.clientId?.substring(0,10)}…</span>
                  <div style={{ display: 'flex', color: '#F59E0B' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < r.rating ? 'currentColor' : 'none'} />)}
                  </div>
                </div>
                <button style={btn('#EF4444', true)} onClick={() => handleDelete(r.id)}><Trash2 size={12} /> Delete</button>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{r.comment}</p>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
                Product: {r.productId?.substring(0,8)}… · {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Tab: Disputes ──────────────────────────────────────────────────────────
function TabDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any>(null);
  const [resolution, setResolution] = useState('');

  const load = () => {
    setLoading(true);
    adminService.getDisputes().then(setDisputes).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleResolve = async (refund: boolean) => {
    if (!selected || !resolution.trim()) return;
    await adminService.resolveDispute(selected.id, resolution, refund, selected.orderId);
    setDisputes(prev => prev.filter(d => d.id !== selected.id));
    setSelected(null);
    setResolution('');
  };

  const handleReject = async () => {
    if (!selected || !resolution.trim()) return;
    await adminService.rejectDispute(selected.id, resolution);
    setDisputes(prev => prev.filter(d => d.id !== selected.id));
    setSelected(null);
    setResolution('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{disputes.filter(d => d.status === 'open').length} open disputes</span>
        <button style={btn('var(--primary)', true)} onClick={load}><RefreshCw size={14} /></button>
      </div>

      {loading ? <Loader /> : (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {disputes.length === 0 && <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center' }}>No disputes</p>}
            {disputes.map(d => (
              <div key={d.id} style={{ ...card, cursor: 'pointer', border: selected?.id === d.id ? '1px solid var(--primary)' : undefined }} onClick={() => setSelected(d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Dispute #{d.id.substring(0,8)}</span>
                  <span style={badge(d.status === 'open' ? '#F59E0B' : d.status === 'resolved' ? '#10B981' : '#EF4444')}>{d.status}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{d.reason}</p>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)' }}>
                  Order: {d.orderId?.substring(0,8)}… · {new Date(d.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div style={card}>
              <h3 style={{ fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Gavel size={18} /> Resolve Dispute
              </h3>
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Reason:</div>
                <p style={{ fontSize: '0.9rem' }}>{selected.reason}</p>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>
                  Order: {selected.orderId} · Client: {selected.clientId?.substring(0,10)}…
                </div>
              </div>
              <textarea value={resolution} onChange={e => setResolution(e.target.value)} placeholder="Enter resolution decision…"
                style={{ width: '100%', minHeight: '100px', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'none', outline: 'none', marginBottom: '1rem' }} />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button style={btn('#10B981')} onClick={() => handleResolve(true)}>
                  <CheckCircle size={14} /> Resolve + Refund
                </button>
                <button style={btn('#3B82F6')} onClick={() => handleResolve(false)}>
                  <CheckCircle size={14} /> Resolve (No Refund)
                </button>
                <button style={btn('#EF4444', true)} onClick={handleReject}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Tab: Settings ──────────────────────────────────────────────────────────
function TabSettings() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showStripe, setShowStripe] = useState(false);

  useEffect(() => {
    adminService.getSettings().then(setSettings).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await adminService.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const set = (key: keyof PlatformSettings, val: any) =>
    setSettings(prev => prev ? { ...prev, [key]: val } : null);

  if (loading || !settings) return <Loader />;

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={card}>
      <h3 style={{ fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.75rem' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{children}</div>
    </div>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '1rem', alignItems: 'center' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  );

  const input = (val: any, onChange: (v: any) => void, type = 'text') => (
    <input type={type} value={val} onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
      style={{ padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', outline: 'none', width: '100%' }} />
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <Section title="Platform Identity">
        <Field label="Platform Name">{input(settings.platformName, v => set('platformName', v))}</Field>
        <Field label="Logo URL">{input(settings.logoUrl, v => set('logoUrl', v))}</Field>
        <Field label="Primary Color">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <input type="color" value={settings.primaryColor} onChange={e => set('primaryColor', e.target.value)}
              style={{ width: '48px', height: '36px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer', background: 'none' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{settings.primaryColor}</span>
          </div>
        </Field>
      </Section>

      <Section title="Financial">
        <Field label="Commission Rate (%)">
          {input(settings.commissionRate, v => set('commissionRate', v), 'number')}
        </Field>
        <Field label="Seller Subscription ($)">
          {input(settings.sellerSubscriptionFee, v => set('sellerSubscriptionFee', v), 'number')}
        </Field>
      </Section>

      <Section title="Integrations">
        <Field label="Stripe API Key">
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input type={showStripe ? 'text' : 'password'} value={settings.stripeKey} onChange={e => set('stripeKey', e.target.value)}
              style={{ flex: 1, padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', outline: 'none' }} />
            <button style={btn('var(--primary)', true)} onClick={() => setShowStripe(v => !v)}>
              {showStripe ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </Field>
        <Field label="SMTP Host">{input(settings.smtpHost, v => set('smtpHost', v))}</Field>
      </Section>

      <Section title="Legal Documents">
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Terms & Conditions</label>
          <textarea value={settings.termsText} onChange={e => set('termsText', e.target.value)} rows={5}
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'vertical', outline: 'none' }} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Privacy Policy</label>
          <textarea value={settings.privacyText} onChange={e => set('privacyText', e.target.value)} rows={5}
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', resize: 'vertical', outline: 'none' }} />
        </div>
      </Section>

      <button onClick={handleSave} disabled={saving} style={{
        ...btn(saved ? '#10B981' : 'var(--primary)'),
        padding: '0.85rem 2rem', fontSize: '0.95rem', alignSelf: 'flex-start',
        boxShadow: saved ? '0 0 20px rgba(16,185,129,0.3)' : '0 0 20px var(--primary-glow)',
      }}>
        {saving ? <RefreshCw size={16} /> : <Save size={16} />}
        {saved ? 'Saved!' : saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  );
}

// ── Shared: Loader ─────────────────────────────────────────────────────────
function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ width: '36px', height: '36px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
      Loading…
    </div>
  );
}
