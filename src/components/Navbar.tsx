"use client";

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCartAnimation } from '@/contexts/CartAnimationContext';
import Link from 'next/link';
import { Search, Sun, Moon, LogIn } from 'lucide-react';

export function Navbar() {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { cartIconRef } = useCartAnimation();

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
          <Search size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder={t('search_placeholder')} 
            className="search-bar"
            style={{ paddingLeft: '3rem', width: '400px' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button 
          onClick={() => setLanguage(language === 'en' ? 'ru' : 'en')}
          className="glass-card"
          style={{ 
            width: '44px', 
            height: '44px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: '800', 
            cursor: 'pointer', 
            border: '1px solid var(--primary)',
            background: 'rgba(138, 63, 252, 0.1)',
            color: 'var(--primary)',
            fontSize: '0.9rem'
          }}
        >
          {language.toUpperCase()}
        </button>

        <button 
          onClick={toggleTheme}
          className="glass-card"
          style={{ 
            width: '44px', 
            height: '44px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer', 
            border: '1px solid #00e0ff',
            background: 'rgba(0, 224, 255, 0.1)',
            color: '#00e0ff'
          }}
        >
          {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }} />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.email?.split('@')[0]}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@user.{user.uid.substring(0,6)}</p>
            </div>
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', padding: '2px', cursor: 'pointer' }}>
                <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>
                  {user.email?.[0].toUpperCase()}
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <Link href="/login" className="btn-neon" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogIn size={18} />
            {t('login')}
          </Link>
        )}
      </div>
    </header>
  );
}
