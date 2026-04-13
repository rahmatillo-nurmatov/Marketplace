"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { db } from '@/lib/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export function ProfileMenu() {
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [newNick, setNewNick] = useState(profile?.displayName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdateNick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { displayName: newNick });
      setIsEditingNick(false);
      // Profile in AuthContext will be updated on next onAuthStateChanged or we can manually refresh
      // For simplicity in MVP, we assume it's updated or user refreshes
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { cardInfo: { last4: cardNumber.slice(-4), addedAt: Date.now() } });
      setIsAddingCard(false);
      setCardNumber('');
      alert('Card added (simulated)');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="profile-menu-container" ref={menuRef} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="profile-trigger"
        style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border)', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          padding: 0,
          overflow: 'hidden'
        }}
      >
        <div style={{ color: 'var(--text-main)', fontWeight: 700 }}>
          {profile?.displayName?.[0]?.toUpperCase() || 'U'}
        </div>
      </button>

      {isOpen && (
        <div className="profile-dropdown" style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '1rem',
          width: '280px',
          background: 'var(--bg-card)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          padding: '1.5rem',
          zIndex: 100,
          color: 'var(--text-main)'
        }}>
          <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
            {isEditingNick ? (
              <form onSubmit={handleUpdateNick} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  value={newNick} 
                  onChange={(e) => setNewNick(e.target.value)}
                  style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.25rem 0.5rem', borderRadius: '4px', width: '100%' }}
                />
                <button type="submit" style={{ background: 'var(--primary)', border: 'none', borderRadius: '4px', padding: '2px 8px', color: 'white' }}>✓</button>
              </form>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600 }}>{profile?.displayName || 'User'}</div>
                <button onClick={() => setIsEditingNick(true)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.75rem' }}>Edit</button>
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{profile?.email}</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link href="/cart" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
              <span>🛒</span> View Cart
            </Link>
            <Link href="/history" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
              <span>📜</span> History & Expenses
            </Link>
            
            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />

            <div style={{ fontSize: '0.875rem' }}>
              {isAddingCard ? (
                <form onSubmit={handleAddCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    placeholder="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{ background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.4rem', borderRadius: '4px' }}
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0.25rem', fontSize: '0.75rem' }}>Add Card</button>
                </form>
              ) : (
                <button onClick={() => setIsAddingCard(true)} style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>💳</span> Add Payment Card
                </button>
              )}
            </div>

            <button 
              onClick={toggleTheme}
              style={{ background: 'none', border: 'none', color: 'var(--text-main)', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', fontSize: '0.875rem' }}
            >
              <span>{theme === 'dark' ? '☀️' : '🌙'}</span> {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>

            <div style={{ height: '1px', background: 'var(--border)', margin: '0.5rem 0' }} />

            <button 
              onClick={logout}
              style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: 600 }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
