"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/lib/services/productService';
import { reviewService } from '@/lib/services/reviewService';
import { orderService } from '@/lib/services/orderService';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProductTranslation } from '@/hooks/useProductTranslation';
import { Product, Review as ReviewType } from '@/types';
import { 
  Star, ShoppingCart, ShieldCheck, Truck, 
  ArrowLeft, MessageSquare, User, Package, Box, Tag, Calendar, Hash
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBought, setHasBought] = useState(false);
  
  const { content: translatedContent } = useProductTranslation(product);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const decodedId = decodeURIComponent(id as string);
      const fetchProductData = async () => {
        try {
          const p = await productService.getProductById(decodedId);
          setProduct(p);
          
          if (p) {
            if (p.colors?.[0]) setSelectedColor(p.colors[0]);
            if (p.sizes?.[0]) setSelectedSize(p.sizes[0]);
            
            // Fetch reviews independently
            reviewService.getReviewsByProduct(decodedId)
              .then(setReviews)
              .catch(err => console.error("Error fetching reviews:", err));
              
            // Fetch order history independently
            if (user) {
              orderService.checkIfUserBoughtProduct(user.uid, decodedId)
                .then(setHasBought)
                .catch(err => console.error("Error checking order history:", err));
            }
          }
        } catch (err) {
          console.error("Error fetching product:", err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProductData();
    }
  }, [id, user]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;

    setSubmittingReview(true);
    try {
      const decodedId = decodeURIComponent(id as string);
      await reviewService.addReview({
        productId: decodedId,
        clientId: user.uid,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      
      const updated = await reviewService.getReviewsByProduct(decodedId);
      setReviews(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
       addToCart(product);
       alert(t('add_to_cart_success')); // Or localized string
    }
  };

  if (loading) return <div style={{ padding: '10rem', textAlign: 'center', color: 'var(--text-muted)' }}>{t('processing')}</div>;
  if (!product) return (
    <div style={{ padding: '10rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('product_not_found')}</h2>
      <button onClick={() => router.back()} className="btn-neon">{t('back')}</button>
    </div>
  );

  const getCategoryName = (catId: string) => {
    return t(catId as any) || catId;
  };

  return (
    <div style={{ padding: '2rem 0', maxWidth: '1400px', margin: '0 auto' }}>
      <button 
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1.2fr', gap: '4rem', marginBottom: '5rem' }}>
        {/* Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '1rem', borderRadius: '24px', overflow: 'hidden' }}>
             <img 
               src={product.images[activeImage] || 'https://via.placeholder.com/600'} 
               alt={product.name} 
               style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '16px' }} 
             />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {product.images.map((img, i) => (
                <img 
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i}`}
                  onClick={() => setActiveImage(i)}
                  style={{ 
                    width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px', 
                    cursor: 'pointer', border: activeImage === i ? '2px solid var(--primary)' : '2px solid transparent',
                    opacity: activeImage === i ? 1 : 0.6
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span className="badge-pro" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Tag size={12} /> {getCategoryName(product.categoryId)}
                </span>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Hash size={12} /> ID: {product.id}
                </span>
                <div style={{ display: 'flex', color: '#F59E0B', alignItems: 'center', gap: '0.25rem' }}>
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'currentColor' : 'none'} />)}
                   <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({reviews.length})</span>
                </div>
              </div>
              <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem', lineHeight: 1.1, transition: 'opacity 0.3s' }}>{translatedContent.name}</h1>
              
           </div>

           <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>${product.price.toFixed(2)}</div>
             <div style={{ textAlign: 'right' }}>
               <div style={{ fontWeight: 800, color: product.stock > 0 ? '#10B981' : '#EF4444', marginBottom: '0.25rem' }}>
                 {product.stock > 0 ? t('in_stock_count', { count: product.stock }) : t('out_of_stock')}
               </div>
               <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('seller_label')}: {product.sellerId}</div>
             </div>
           </div>

           <div className="glass-card" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 700 }}>{t('specs_and_description')}</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.8, transition: 'opacity 0.3s' }}>{translatedContent.description}</p>
             <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Calendar size={16} /> {t('added_on')}: {new Date(product.createdAt).toLocaleDateString()}
               </span>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Box size={16} /> {t('status_label')}: {product.status === 'approved' ? t('approved') : t('on_review')}
               </span>
             </div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem 0' }}>
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('colors')}</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                     {product.colors.map(c => (
                       <button 
                         key={c}
                         onClick={() => setSelectedColor(c)}
                         style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: selectedColor === c ? '2px solid var(--primary)' : '1px solid var(--border)', background: selectedColor === c ? 'rgba(138, 63, 252, 0.1)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                       >
                         {c}
                       </button>
                     ))}
                  </div>
                </div>
              )}

              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('sizes')}</h4>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                     {product.sizes.map(s => (
                       <button 
                         key={s}
                         onClick={() => setSelectedSize(s)}
                         style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: selectedSize === s ? '2px solid var(--primary)' : '1px solid var(--border)', background: selectedSize === s ? 'rgba(138, 63, 252, 0.1)' : 'transparent', color: 'white', cursor: 'pointer', fontWeight: 700 }}
                       >
                         {s}
                       </button>
                     ))}
                  </div>
                </div>
              )}
           </div>

           <div style={{ display: 'flex', gap: '1.5rem' }}>
              <button 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-neon" 
                style={{ flex: 1, padding: '1.5rem', fontSize: '1.125rem', opacity: product.stock <= 0 ? 0.5 : 1 }}
              >
                <ShoppingCart size={20} style={{ marginRight: '0.75rem' }} /> 
                {product.stock > 0 ? t('add_to_cart') : t('out_of_stock')}
              </button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 <ShieldCheck size={20} color="#10B981" />
                 <span>{t('security_guarantee')}</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 <Truck size={20} color="var(--primary)" />
                 <span>{t('express_delivery')}</span>
              </div>
           </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div style={{ maxWidth: '800px' }}>
         <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <MessageSquare size={28} /> {t('reviews')}
         </h2>

         {user && hasBought ? (
           <form onSubmit={handleAddReview} className="glass-card" style={{ padding: '2rem', marginBottom: '4rem' }}>
              <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>{t('leave_review')}</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                 {[1, 2, 3, 4, 5].map(star => (
                   <button key={star} type="button" onClick={() => setNewRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: star <= newRating ? '#F59E0B' : 'var(--border)' }}>
                      <Star size={24} fill={star <= newRating ? 'currentColor' : 'none'} />
                   </button>
                 ))}
              </div>
              <textarea 
                required
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={t('review_placeholder')}
                style={{ width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', minHeight: '120px', resize: 'none', outline: 'none', marginBottom: '1.5rem' }}
              />
              <button disabled={submittingReview} type="submit" className="btn-neon" style={{ padding: '0.75rem 2rem' }}>
                {submittingReview ? t('sending') : t('publish')}
              </button>
           </form>
         ) : user ? (
           <div className="glass-card" style={{ padding: '2rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(138, 63, 252, 0.3)', background: 'rgba(138, 63, 252, 0.05)' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              <div style={{ fontSize: '0.9rem' }}>
                 {t('verified_purchase_only')}
              </div>
           </div>
         ) : (
           <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>{t('login_to_review')}</p>
           </div>
         )}

         <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {reviews.length > 0 ? reviews.map(review => (
              <div key={review.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                       <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                          <User size={16} />
                       </div>
                       <span style={{ fontWeight: 700 }}>{review.clientId.substring(0,6)}...</span>
                    </div>
                    <div style={{ display: 'flex', color: '#F59E0B' }}>
                       {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />)}
                    </div>
                 </div>
                 <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{review.comment}</p>
                 <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.75rem' }}>{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px dashed var(--border)', color: 'var(--text-muted)' }}>
                 {t('no_reviews_yet')}
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
