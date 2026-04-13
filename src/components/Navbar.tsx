"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '3rem',
      padding: '0 0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>󰄉</span>
          <input 
            type="text" 
            placeholder="Search items, collections..." 
            className="search-bar"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
          className="glass-card"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', cursor: 'pointer', border: '1px solid var(--border)' }}
        >
          {language.toUpperCase()}
        </button>

        <button 
          onClick={toggleTheme}
          className="glass-card"
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}
        >
          {theme === 'dark' ? '󰄭' : '󰄫'}
        </button>

        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.email?.split('@')[0]}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@user.{user.uid.substring(0,6)}</p>
            </div>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '2px' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                {user.email?.[0].toUpperCase()}
              </div>
            </div>
            <Link href="/checkout" className="btn-neon" style={{ padding: '0.6rem 1.25rem' }}>Connect</Link>
          </div>
        ) : (
          <Link href="/login" className="btn-neon">Login</Link>
        )}
      </div>
    </header>
  );
}
