"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Shield, CreditCard, Settings, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;

  return (
    <ProtectedRoute allowedRoles={['client', 'seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem' }}>Профиль</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
          {/* Profile Card */}
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 2rem' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '4px' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800 }}>
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
              <button className="glass-card" style={{ position: 'absolute', bottom: '0', right: '0', padding: '0.5rem', borderRadius: '50%', background: 'var(--bg-side)', border: '1px solid var(--primary)', cursor: 'pointer' }}>
                 <Camera size={16} color="white" />
              </button>
            </div>
            
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{user.email?.split('@')[0]}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>{user.email}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
               <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Роль</p>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Premium</p>
               </div>
               <div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Заказов</p>
                  <p style={{ fontWeight: 700 }}>12</p>
               </div>
            </div>
          </div>

          {/* Settings / Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Settings size={20} color="var(--primary)" />
                   Настройки аккаунта
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <User size={18} color="var(--text-muted)" />
                         <span>Сменить никнейм</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Изменить</button>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <Mail size={18} color="var(--text-muted)" />
                         <span>Электронная почта</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{user.email}</span>
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <Shield size={18} color="var(--text-muted)" />
                         <span>Безопасность</span>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Настроить</button>
                   </div>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <CreditCard size={20} color="var(--accent)" />
                   Способы оплаты
                </h3>
                <div style={{ padding: '2rem', border: '2px dashed var(--border)', borderRadius: '16px', textAlign: 'center' }}>
                   <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Нет привязанных карт</p>
                   <button className="btn-neon" style={{ background: 'var(--accent)', boxShadow: '0 0 15px rgba(0, 224, 255, 0.3)' }}>+ Добавить карту</button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
