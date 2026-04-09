"use client";

import React from 'react';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Look around the catalog to find amazing products.</p>
        <Link href="/" className="btn-primary" style={{ display: 'inline-block', width: 'auto' }}>
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 2fr) minmax(300px, 1fr)', gap: '2rem' }}>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '1rem', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1rem', boxShadow: 'var(--shadow)' }}>
              <img src={item.images?.[0] || 'https://via.placeholder.com/150'} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{item.name}</h3>
                <div style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>${item.price.toFixed(2)}</div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'var(--bg-color)', cursor: 'pointer' }}>-</button>
                    <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'var(--bg-color)', cursor: 'pointer' }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-muted)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <span>Total</span>
            <span style={{ color: 'var(--primary)' }}>${total.toFixed(2)}</span>
          </div>
          
          <Link href="/checkout" className="btn-primary" style={{ display: 'block', textAlign: 'center' }}>
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
