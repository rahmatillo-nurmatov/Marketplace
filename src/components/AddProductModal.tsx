"use client";

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { productService } from '@/lib/services/productService';
import { storageService } from '@/lib/services/storageService';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Upload, Palette, Ruler } from 'lucide-react';

interface AddProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function AddProductModal({ onClose, onSuccess }: AddProductModalProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cost: '',
    stock: '',
    category: 'electronics',
    colors: '',
    sizes: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let imageUrl = 'https://via.placeholder.com/600x400?text=Product+Image';
      
      if (imageFile) {
        imageUrl = await storageService.uploadProductImage(imageFile, user.uid);
      }

      await productService.addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stock: parseInt(formData.stock),
        categoryId: formData.category,
        colors: formData.colors.split(',').map(c => c.trim()).filter(c => c),
        sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s),
        images: [imageUrl],
        sellerId: user.uid,
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    outline: 'none',
    fontSize: '0.9rem',
    transition: 'border-color 0.2s'
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    color: 'var(--text-muted)'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      padding: '2rem'
    }}>
      <div className="glass-card" style={{
        padding: '3rem',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '3rem'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ gridColumn: 'span 2', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>{t('add_new_product')}</h2>
          <p style={{ color: 'var(--text-muted)' }}>{t('fill_product_info')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          {/* Left Side: Images & Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div 
              style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                borderRadius: '16px', 
                border: '2px dashed var(--border)', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.02)'
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Upload size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('upload_photo')}</span>
                </>
              )}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
            </div>

            <div>
              <label style={labelStyle}><Palette size={14}/> {t('colors')} {t('comma_separated')}</label>
              <input 
                placeholder="Black, Red, Silver"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}><Ruler size={14}/> {t('sizes')} {t('comma_separated')}</label>
              <input 
                placeholder="S, M, L, XL"
                value={formData.sizes}
                onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Right Side: Basic Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={labelStyle}>{t('product_name')}</label>
              <input 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={inputStyle}
                placeholder={t('product_name_placeholder')}
              />
            </div>

            <div>
              <label style={labelStyle}>{t('description')}</label>
              <textarea 
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ ...inputStyle, minHeight: '120px', resize: 'none' }}
                placeholder={t('description_placeholder')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('category_label')}</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={inputStyle}
                >
                  <option value="electronics">{t('electronics')}</option>
                  <option value="clothes">{t('clothes')}</option>
                  <option value="furniture">{t('furniture')}</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t('stock')}</label>
                <input 
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>{t('price')} ($)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>{t('cost')} ($)</label>
                <input 
                  required
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="glass-card" style={{ flex: 1, padding: '1rem', fontWeight: 600, cursor: 'pointer' }}>
                {t('cancel')}
              </button>
              <button type="submit" disabled={loading} className="btn-neon" style={{ flex: 2, padding: '1rem', fontSize: '1rem' }}>
                {loading ? t('processing') : t('add_new_product')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
