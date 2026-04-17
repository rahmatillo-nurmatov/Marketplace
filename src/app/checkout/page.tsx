"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { orderService } from '@/lib/services/orderService';
import { productService } from '@/lib/services/productService';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  CreditCard, Truck, ShieldCheck, MapPin, 
  ArrowRight, ArrowLeft, CheckCircle, Package, AlertTriangle 
} from 'lucide-react';

type CheckoutStep = 'address' | 'billing' | 'review' | 'success';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [selectedAddress, setSelectedAddress] = useState(profile?.addresses?.[0] || '');
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvc: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      router.push('/cart');
    }
  }, [items.length, router, step]);

  const finalAddress = isNewAddress ? customAddress : selectedAddress;

  const handleProcessOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?.uid) throw new Error('User not authenticated');
      if (!finalAddress) throw new Error(t('select_shipping_address'));

      // 1. Check & Decrement Stock for all items (using transactions)
      // Note: In a production app, this should be a single batch or cloud function.
      // Here we do it sequentially for simplicity but atomic.
      for (const item of items) {
        await productService.decrementStock(item.id, item.quantity);
      }

      // 2. Create Order
      await orderService.createOrder({
        clientId: user.uid,
        items: items.map(i => ({ 
          productId: i.id, 
          name: i.name, 
          quantity: i.quantity, 
          price: i.price,
          image: i.images?.[0],
          sellerId: i.sellerId
        })),
        total,
        status: 'pending',
        shippingAddress: finalAddress,
        paymentMethod: 'Credit Card',
        cardLast4: cardData.number ? cardData.number.slice(-4) : '4242'
      });

      clearCart();
      setStep('success');
    } catch(err: any) {
      console.error(err);
      setError(err.message || t('processing'));
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: 'rgba(16, 185, 129, 0.1)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 2rem',
          border: '2px solid #10B981'
        }}>
          <CheckCircle size={48} color="#10B981" />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>{t('checkout_success_title')}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem' }}>
          {t('checkout_success_desc')}
        </p>
        <button className="btn-neon" onClick={() => router.push('/history')}>{t('view_in_history')}</button>
      </div>
    );
  }

  const StepIndicator = () => (
    <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '4rem' }}>
      {[
        { id: 'address', label: t('checkout_address') },
        { id: 'billing', label: t('checkout_billing') },
        { id: 'review', label: t('checkout_review') }
      ].map((s, idx) => (
        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', opacity: step === s.id ? 1 : 0.4 }}>
           <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
              {idx + 1}
           </div>
           <span style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>{s.label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem 0', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>{t('checkout_title')}</h1>
        <StepIndicator />

        {error && (
          <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #EF4444', borderRadius: '12px', color: '#EF4444', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertTriangle size={20} />
            {error}
          </div>
        )}
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
          {/* Main Flow */}
          <div className="glass-card" style={{ padding: '3rem' }}>
            
            {step === 'address' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <MapPin size={24} color="var(--primary)" /> {t('select_shipping_address')}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                   {profile?.addresses?.map((addr, idx) => (
                     <button
                       key={idx}
                       onClick={() => { setSelectedAddress(addr); setIsNewAddress(false); }}
                       style={{
                         padding: '1.5rem',
                         borderRadius: '12px',
                         border: !isNewAddress && selectedAddress === addr ? '2px solid var(--primary)' : '1px solid var(--border)',
                         background: !isNewAddress && selectedAddress === addr ? 'rgba(138, 63, 252, 0.05)' : 'rgba(255,255,255,0.02)',
                         textAlign: 'left',
                         cursor: 'pointer',
                         color: 'white',
                         transition: 'all 0.2s'
                       }}
                     >
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{t('address_item', { count: idx + 1 })}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{addr}</div>
                     </button>
                   ))}

                   <button
                     onClick={() => setIsNewAddress(true)}
                     style={{
                       padding: '1.5rem',
                       borderRadius: '12px',
                       border: isNewAddress ? '2px solid var(--primary)' : '1px dashed var(--border)',
                       background: isNewAddress ? 'rgba(138, 63, 252, 0.05)' : 'transparent',
                       textAlign: 'left',
                       cursor: 'pointer',
                       color: 'white',
                       display: 'flex',
                       alignItems: 'center',
                       gap: '1rem'
                     }}
                   >
                      <Plus size={20} color="var(--primary)" />
                      <span style={{ fontWeight: 700 }}>{t('use_new_address')}</span>
                   </button>

                   {isNewAddress && (
                     <textarea 
                       placeholder={t('enter_full_address')}
                       value={customAddress}
                       onChange={(e) => setCustomAddress(e.target.value)}
                       style={{ width: '100%', padding: '1.25rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--primary)', color: 'white', marginTop: '1rem', minHeight: '120px', resize: 'none', outline: 'none' }}
                     />
                   )}
                </div>

                <button 
                  disabled={!finalAddress}
                  className="btn-neon" 
                  style={{ width: '100%', padding: '1.25rem' }}
                  onClick={() => setStep('billing')}
                >
                  {t('next_to_billing')} <ArrowRight size={20} style={{ marginLeft: '0.75rem' }} />
                </button>
              </div>
            )}

            {step === 'billing' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <CreditCard size={24} color="var(--accent)" /> {t('bank_card_demo')}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                   <div className="glass-card" style={{ padding: '2rem', background: 'linear-gradient(135deg, #1a1a2e, #0f0f1d)', border: '1px solid var(--accent)40', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.5 }}><CreditCard size={32} /></div>
                      <div style={{ marginBottom: '2.5rem', fontWeight: 800, letterSpacing: '2px', color: 'var(--accent)' }}>CHIP CARD</div>
                      <input 
                        placeholder="0000 0000 0000 0000"
                        value={cardData.number}
                        onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                        style={{ width: '100%', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 900, outline: 'none', marginBottom: '1.5rem' }}
                      />
                      <div style={{ display: 'flex', gap: '2rem' }}>
                         <input placeholder="MM/YY" style={{ width: '80px', background: 'none', border: 'none', color: 'white', outline: 'none' }} />
                         <input placeholder="CVC" style={{ width: '60px', background: 'none', border: 'none', color: 'white', outline: 'none' }} />
                      </div>
                   </div>
                   <input 
                     placeholder={t('card_name_placeholder')}
                     style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white' }}
                   />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button className="glass-card" style={{ flex: 1, padding: '1.25rem', fontWeight: 700 }} onClick={() => setStep('address')}>{t('back_btn')}</button>
                   <button className="btn-neon" style={{ flex: 2, padding: '1.25rem', background: 'var(--accent)', boxShadow: '0 0 20px rgba(0, 224, 255, 0.4)' }} onClick={() => setStep('review')}>{t('check_order_btn')}</button>
                </div>
              </div>
            )}

            {step === 'review' && (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2.5rem' }}>{t('confirmation_title')}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <MapPin size={20} color="var(--primary)" />
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('shipping_to')}</div>
                         <div style={{ fontSize: '1rem' }}>{finalAddress}</div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <CreditCard size={20} color="var(--accent)" />
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('payment_label')}</div>
                         <div style={{ fontSize: '1rem' }}>Visa •••• 4242</div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', gap: '1rem' }}>
                      <ShieldCheck size={20} color="#10B981" />
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{t('guarantee_label')}</div>
                         <div style={{ fontSize: '1rem' }}>{t('secure_deal_enabled')}</div>
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                   <button className="glass-card" style={{ flex: 1, padding: '1.25rem', fontWeight: 700 }} onClick={() => setStep('billing')}>{t('back_btn')}</button>
                   <button 
                     disabled={loading}
                     className="btn-neon" 
                     style={{ flex: 2, padding: '1.25rem' }} 
                     onClick={handleProcessOrder}
                   >
                     {loading ? t('processing') : t('confirm_and_pay') + ' $' + total.toFixed(2)}
                   </button>
                </div>
              </div>
            )}

          </div>

          {/* Cart Summary Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
               <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={18} /> {t('order_summary_title')}
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                       <span style={{ color: 'var(--text-muted)' }}>{item.quantity}x {item.name}</span>
                       <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900 }}>
                     <span>{t('total_label')}</span>
                     <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
                  </div>
               </div>
            </div>

            <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '12px', fontSize: '0.8rem', color: '#10B981', display: 'flex', gap: '1rem' }}>
               <ShieldCheck size={18} />
               <span>{t('funds_frozen_notice')}</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function Plus({ size, color }: { size: number, color: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
