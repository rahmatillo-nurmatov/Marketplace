"use client";

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { reviewService } from '@/lib/services/reviewService';
import { productService } from '@/lib/services/productService';
import { useLanguage } from '@/contexts/LanguageContext';
import { Review, Product } from '@/types';
import { Star, MessageSquare, Package, Inbox, User, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function SellerReviews() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<(Review & { product?: Product })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!user?.uid) return;
      setLoading(true);
      try {
        const [sellerReviews, sellerProducts] = await Promise.all([
          reviewService.getReviewsBySeller(user.uid),
          productService.getSellerProducts(user.uid)
        ]);

        const enriched = sellerReviews.map(r => ({
          ...r,
          product: sellerProducts.find(p => p.id === r.productId)
        }));

        setReviews(enriched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user]);

  const stats = {
    total: reviews.length,
    average: reviews.length > 0 
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0'
  };

  return (
    <ProtectedRoute allowedRoles={['seller', 'admin']}>
      <div style={{ padding: '2rem 0' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('customer_reviews_title')}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{t('customer_reviews_desc')}</p>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
           <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('avg_rating')}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                 <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F59E0B' }}>{stats.average}</div>
                 <div style={{ display: 'flex', color: '#F59E0B', marginBottom: '0.5rem' }}>
                    {[...Array(5)].map((_, i) => <Star key={i} size={20} fill={i < Math.round(parseFloat(stats.average)) ? 'currentColor' : 'none'} />)}
                 </div>
              </div>
           </div>
           <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{t('total_reviews')}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{stats.total}</div>
           </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>{t('processing')}</div>
        ) : reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {reviews.map(review => (
              <div key={review.id} className="glass-card" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: '3rem' }}>
                {/* Product Reference */}
                <div style={{ borderRight: '1px solid var(--border)', paddingRight: '3rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                      <Package size={14} /> {t('product_label')}
                   </div>
                   {review.product ? (
                     <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', background: '#000', border: '1px solid var(--border)' }}>
                           <img src={review.product.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{review.product.name}</div>
                           <Link href={`/product/${review.productId}`} style={{ fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              {t('go_to_product')} <ArrowUpRight size={12} />
                           </Link>
                        </div>
                     </div>
                   ) : (
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {review.productId}</div>
                   )}
                </div>

                {/* Review Content */}
                <div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                         <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={14} />
                         </div>
                         <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{t('client_label')} {review.clientId.substring(0,8)}</span>
                      </div>
                      <div style={{ display: 'flex', color: '#F59E0B' }}>
                         {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                      </div>
                   </div>
                   <p style={{ fontSize: '1.125rem', lineHeight: 1.6, color: 'white', fontStyle: 'italic' }}>"{review.comment}"</p>
                   <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t('published_at')} {new Date(review.createdAt).toLocaleDateString()}
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '8rem', textAlign: 'center', borderStyle: 'dashed' }}>
             <Inbox size={48} style={{ opacity: 0.2, marginBottom: '2rem', display: 'block', margin: '0 auto' }} />
             <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>{t('no_customer_reviews')}</p>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
