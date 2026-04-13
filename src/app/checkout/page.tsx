"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { orderService } from '@/lib/services/orderService';
import { useLanguage } from '@/contexts/LanguageContext';
import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!user?.uid) throw new Error('User not authenticated');

      await orderService.createOrder({
        clientId: user.uid,
        items: items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
        total,
        status: 'pending',
        shippingAddress: address
      });

      clearCart();
      alert(t('checkout') + ' success!');
      router.push('/?success=1');
    } catch(err) {
      console.error(err);
      alert('Error placing order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '3rem' }}>Оплата заказа</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
          {/* Left: Shipping Form */}
          <form onSubmit={handleCheckout} className="glass-card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
               <Truck size={20} color="var(--primary)" />
               Адрес доставки
            </h3>
            
            <textarea 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Введите полный адрес (Город, улица, дом, кв)..."
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', 
                color: 'white',
                fontFamily: 'inherit', 
                minHeight: '150px', 
                resize: 'none',
                outline: 'none',
                marginBottom: '2rem'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
               <ShieldCheck size={18} color="#10B981" />
               Ваши данные защищены сквозным шифрованием.
            </div>

            <button type="submit" disabled={loading} className="btn-neon" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem' }}>
               <CreditCard size={20} style={{ marginRight: '0.75rem' }} />
               {loading ? 'Обработка платежа...' : 'Оплатить $' + total.toFixed(2)}
            </button>
          </form>

          {/* Right: Order Summary */}
          <div className="glass-card" style={{ padding: '2rem', height: 'fit-content' }}>
             <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>Итого к оплате</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                     <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</span>
                     <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800 }}>
                   <span>Всего</span>
                   <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
