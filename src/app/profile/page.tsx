"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/contexts/AuthContext';
import { 
  User, Mail, Shield, CreditCard, Settings, 
  Camera, Check, X, ShieldAlert, Briefcase, ShoppingBag,
  MapPin, Plus, Trash2
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateRole, updateAddresses } = useAuth();
  const { t } = useLanguage();
  
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [nick, setNick] = useState(profile?.displayName || user?.email?.split('@')[0] || 'User');
  const [tempNick, setTempNick] = useState(nick);
  
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isChangingPhoto, setIsChangingPhoto] = useState(false);
  const [isSettingSecurity, setIsSettingSecurity] = useState(false);

  // Address State
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  if (!user) return null;

  const handleSaveNick = () => {
    setNick(tempNick);
    setIsEditingNick(false);
  };

  const roles: { id: UserRole; icon: any; color: string; label: string }[] = [
    { id: 'client', icon: ShoppingBag, color: '#3B82F6', label: t('role_buyer') },
    { id: 'seller', icon: Briefcase, color: '#8a3ffc', label: t('role_seller') },
    { id: 'admin', icon: ShieldAlert, color: '#EF4444', label: t('role_admin') }
  ];

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    const updated = [...(profile?.addresses || []), newAddress.trim()];
    await updateAddresses(updated);
    setNewAddress('');
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = async (index: number) => {
    const updated = [...(profile?.addresses || [])];
    updated.splice(index, 1);
    await updateAddresses(updated);
  };

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem' }}>{t('sidebar_profile')}</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
          {/* Left Side: Profile Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '4px' }}>
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, overflow: 'hidden' }}>
                    {isChangingPhoto ? (
                       <div style={{ fontSize: '0.8rem', padding: '1rem' }}>Uploading...</div>
                    ) : (
                      user.email?.[0].toUpperCase()
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => setIsChangingPhoto(true)}
                  className="glass-card" 
                  style={{ position: 'absolute', bottom: '0', right: '0', padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-side)', border: '1px solid var(--primary)', cursor: 'pointer' }}
                >
                   <Camera size={16} color="white" />
                </button>
              </div>
              
              {isEditingNick ? (
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                  <input 
                    value={tempNick} 
                    onChange={(e) => setTempNick(e.target.value)}
                    style={{ background: 'var(--bg-side)', border: '1px solid var(--primary)', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', textAlign: 'center', outline: 'none' }}
                  />
                  <button onClick={handleSaveNick} style={{ background: 'green', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '0.25rem' }}><Check size={16}/></button>
                  <button onClick={() => setIsEditingNick(false)} style={{ background: 'red', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer', padding: '0.25rem' }}><X size={16}/></button>
                </div>
              ) : (
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{nick}</h2>
              )}
              
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>{user.email}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                 <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('status')}</p>
                    <p style={{ fontWeight: 700, color: 'var(--primary)', textTransform: 'capitalize' }}>{profile?.role || 'client'}</p>
                 </div>
                 <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('orders_count')}</p>
                    <p style={{ fontWeight: 700 }}>12</p>
                 </div>
              </div>
            </div>

            {/* Role Switcher */}
            <div className="glass-card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <ShieldAlert size={20} color="var(--primary)" />
                 {t('active_role_selection')}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                {t('active_role_desc')}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = profile?.role === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => updateRole(role.id)}
                      className="glass-card"
                      style={{
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        cursor: 'pointer',
                        border: isActive ? `1px solid ${role.color}` : '1px solid var(--border)',
                        background: isActive ? `${role.color}15` : 'transparent',
                        textAlign: 'left',
                        width: '100%',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ padding: '0.5rem', borderRadius: '8px', background: `${role.color}20` }}>
                        <Icon size={20} color={role.color} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: isActive ? role.color : 'white' }}>{role.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {isActive ? t('current_role') : t('switch_to_role', { role: role.label.toLowerCase() })}
                        </div>
                      </div>
                      {isActive && <Check size={20} color={role.color} />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             {/* Addresses Section */}
             <div className="glass-card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                   <h3 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MapPin size={20} color="var(--primary)" />
                      {t('shipping_address')}
                   </h3>
                   <button 
                     onClick={() => setIsAddingAddress(true)}
                     style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, fontSize: '0.875rem' }}
                   >
                     <Plus size={16} /> {t('add_btn')}
                   </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {profile?.addresses?.map((addr, idx) => (
                     <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: '0.9rem', flex: 1, marginRight: '1rem' }}>{addr}</div>
                        <button 
                          onClick={() => handleRemoveAddress(idx)}
                          style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '0.5rem' }}
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   ))}
                   
                   {isAddingAddress && (
                     <div style={{ padding: '1rem', background: 'rgba(138, 63, 252, 0.05)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                        <textarea 
                          autoFocus
                          value={newAddress}
                          onChange={(e) => setNewAddress(e.target.value)}
                          placeholder={t('address_placeholder')}
                          style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none', minHeight: '80px', resize: 'none', fontSize: '0.9rem', marginBottom: '1rem' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                           <button onClick={handleAddAddress} style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>{t('save_btn')}</button>
                           <button onClick={() => { setIsAddingAddress(false); setNewAddress(''); }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>{t('cancel_btn')}</button>
                        </div>
                     </div>
                   )}

                   {(!profile?.addresses || profile.addresses.length === 0) && !isAddingAddress && (
                     <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                        {t('no_addresses')}
                     </div>
                   )}
                </div>
             </div>

             <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Settings size={20} color="var(--primary)" />
                   {t('account_settings')}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <User size={18} color="var(--text-muted)" />
                         <span>{t('change_nick')}</span>
                      </div>
                      <button 
                        onClick={() => setIsEditingNick(true)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                      >
                         {t('details')}
                      </button>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <Mail size={18} color="var(--text-muted)" />
                         <span>{t('email')}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <Shield size={18} color="var(--text-muted)" />
                         <span>{t('security')}</span>
                      </div>
                      <button 
                        onClick={() => setIsSettingSecurity(!isSettingSecurity)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
                      >
                         {isSettingSecurity ? t('enabled') : t('configure')}
                      </button>
                   </div>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <CreditCard size={20} color="var(--accent)" />
                   {t('payment_methods')}
                </h3>
                {isAddingCard ? (
                  <div style={{ padding: '1rem', border: '1px solid var(--accent)', borderRadius: '12px', background: 'rgba(0, 224, 255, 0.05)' }}>
                     <input placeholder={t('card_number_placeholder')} style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none', marginBottom: '0.5rem' }} />
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => setIsAddingCard(false)} className="btn-neon" style={{ background: 'var(--accent)', scale: '0.8' }}>{t('save_btn')}</button>
                        <button onClick={() => setIsAddingCard(false)} style={{ background: 'transparent', color: 'white', border: 'none', cursor: 'pointer' }}>{t('cancel_btn')}</button>
                     </div>
                  </div>
                ) : (
                  <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                     <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('no_cards')}</p>
                     <button onClick={() => setIsAddingCard(true)} className="btn-neon" style={{ background: 'var(--accent)', boxShadow: '0 0 15px rgba(0, 224, 255, 0.3)' }}>+ {t('add_card')}</button>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
