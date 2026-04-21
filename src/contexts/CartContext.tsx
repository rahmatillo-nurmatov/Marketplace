"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

// Unique key per cart line (same product, different color/size = different line)
function itemKey(id: string, color?: string, size?: string) {
  return `${id}__${color ?? ''}__${size ?? ''}`;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  total: 0,
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setItems(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    // Defer to avoid blocking render
    const id = setTimeout(() => {
      localStorage.setItem('cart', JSON.stringify(items));
    }, 100);
    return () => clearTimeout(id);
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setItems(current => {
      const key = itemKey(product.id, selectedColor, selectedSize);
      const existing = current.find(i => itemKey(i.id, i.selectedColor, i.selectedSize) === key);
      if (existing) {
        return current.map(i =>
          itemKey(i.id, i.selectedColor, i.selectedSize) === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...current, { ...product, quantity, selectedColor, selectedSize }];
    });
  };

  const removeFromCart = (productId: string, selectedColor?: string, selectedSize?: string) => {
    const key = itemKey(productId, selectedColor, selectedSize);
    setItems(current => current.filter(i => itemKey(i.id, i.selectedColor, i.selectedSize) !== key));
  };

  const updateQuantity = (productId: string, quantity: number, selectedColor?: string, selectedSize?: string) => {
    const key = itemKey(productId, selectedColor, selectedSize);
    if (quantity <= 0) {
      setItems(current => current.filter(i => itemKey(i.id, i.selectedColor, i.selectedSize) !== key));
      return;
    }
    setItems(current =>
      current.map(i =>
        itemKey(i.id, i.selectedColor, i.selectedSize) === key ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};
