"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
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
    // No manual user check needed here as ProtectedRoute handles it
    
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer fake-token-${user?.uid}`
        },
        body: JSON.stringify({
          clientId: user?.uid,
          items: items.map(i => ({ productId: i.id, name: i.name, quantity: i.quantity, price: i.price })),
          total,
          status: 'pending',
          shippingAddress: address
        })
      });

      if (response.ok) {
        clearCart();
        alert('Order placed successfully!');
        router.push('/?success=1');
      } else {
        alert('Payment failed or server error.');
      }
    } catch(err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: '4rem 0', maxWidth: '600px' }}>
        <h1 className="auth-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Checkout</h1>
        
        <form onSubmit={handleCheckout} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 600 }}>Shipping Information</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Full Address</label>
            <textarea 
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, New York, NY 10001"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'inherit', minHeight: '100px', resize: 'vertical' }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '2rem 0' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Total to pay:</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Processing Payment...' : 'Pay & Place Order'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
