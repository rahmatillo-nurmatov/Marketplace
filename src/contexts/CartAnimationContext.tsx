"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface FlyItem {
  id: number;
  x: number;
  y: number;
  image: string;
}

interface CartAnimationContextType {
  cartIconRef: React.RefObject<HTMLElement | null>;
  flyToCart: (fromEl: HTMLElement, image: string) => void;
}

const CartAnimationContext = createContext<CartAnimationContextType>({
  cartIconRef: { current: null },
  flyToCart: () => {},
});

export const useCartAnimation = () => useContext(CartAnimationContext);

export function CartAnimationProvider({ children }: { children: React.ReactNode }) {
  const cartIconRef = useRef<HTMLElement | null>(null);
  const [items, setItems] = useState<FlyItem[]>([]);
  const counter = useRef(0);

  const flyToCart = useCallback((fromEl: HTMLElement, image: string) => {
    const fromRect = fromEl.getBoundingClientRect();
    const id = ++counter.current;

    const startX = fromRect.left + fromRect.width / 2 - 20;
    const startY = fromRect.top + fromRect.height / 2 - 20;

    setItems(prev => [...prev, { id, x: startX, y: startY, image }]);

    // Get cart icon position
    const cartEl = cartIconRef.current;
    const cartRect = cartEl
      ? cartEl.getBoundingClientRect()
      : { left: window.innerWidth - 40, top: 20, width: 24, height: 24 };

    const endX = cartRect.left + cartRect.width / 2 - 20;
    const endY = cartRect.top + cartRect.height / 2 - 20;

    // Animate via Web Animations API
    requestAnimationFrame(() => {
      const el = document.getElementById(`fly-item-${id}`);
      if (!el) return;

      el.animate([
        { transform: `translate(0, 0) scale(1)`, opacity: 1 },
        { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0.15)`, opacity: 0.6, offset: 0.85 },
        { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 },
      ], {
        duration: 650,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards',
      }).onfinish = () => {
        setItems(prev => prev.filter(i => i.id !== id));
        // Pulse the cart icon
        if (cartEl) {
          cartEl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.4)' },
            { transform: 'scale(1)' },
          ], { duration: 300, easing: 'ease-out' });
        }
      };
    });
  }, []);

  return (
    <CartAnimationContext.Provider value={{ cartIconRef, flyToCart }}>
      {children}
      {/* Flying items layer */}
      {items.map(item => (
        <div
          key={item.id}
          id={`fly-item-${item.id}`}
          style={{
            position: 'fixed',
            left: item.x,
            top: item.y,
            width: 40,
            height: 40,
            borderRadius: '8px',
            overflow: 'hidden',
            border: '2px solid var(--primary)',
            boxShadow: '0 0 12px var(--primary-glow)',
            zIndex: 999999,
            pointerEvents: 'none',
          }}
        >
          <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
    </CartAnimationContext.Provider>
  );
}
