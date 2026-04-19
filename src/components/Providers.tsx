"use client";

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CartAnimationProvider } from '../contexts/CartAnimationContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <CartAnimationProvider>
              {children}
            </CartAnimationProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
