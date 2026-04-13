"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { storageService } from '@/lib/services/storageService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditProductModal({ product, onClose, onSuccess }: EditProductModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    cost: product.cost.toString(),
    stock: product.stock.toString(),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let imageUrl = product.images?.[0];
      
      if (imageFile) {
        imageUrl = await storageService.uploadProductImage(imageFile, user.uid);
      }

      await productService.updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        images: [imageUrl || 'https://via.placeholder.com/600x400?text=Product+Image'],
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '500px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>{t('edit_product')}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('catalog')} Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('description')}</label>
            <textarea 
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', minHeight: '80px' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('price')} ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('cost')} ($)</label>
              <input 
                required
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('stock')}</label>
            <input 
              required
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              style={{ width: '100%', background: 'var(--bg-color)', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>{t('image')}</label>
            <input 
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              style={{ width: '100%', color: 'var(--text-main)', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, background: 'none', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>{t('cancel')}</button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 2 }}>{loading ? t('processing') : t('save_changes')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
