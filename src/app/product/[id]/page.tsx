"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/lib/services/productService';
import { reviewService } from '@/lib/services/reviewService';
import { orderService } from '@/lib/services/orderService';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product, Review as ReviewType } from '@/types';
import { 
  Star, ShoppingCart, ShieldCheck, Truck, 
  ArrowLeft, MessageSquare, User, Package, Box 
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasBought, setHasBought] = useState(false);
  
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        productService.getProductById(id as string),
        reviewService.getReviewsByProduct(id as string),
        user ? orderService.checkIfUserBoughtProduct(user.uid, id as string) : Promise.resolve(false)
      ]).then(([p, r, bought]) => {
        setProduct(p);
        setReviews(r);
        setHasBought(bought);
        if (p?.colors?.[0]) setSelectedColor(p.colors[0]);
        if (p?.sizes?.[0]) setSelectedSize(p.sizes[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id || !newComment.trim()) return;

    setSubmittingReview(true);
    try {
      await reviewService.addReview({
        productId: id as string,
        clientId: user.uid,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      // Refresh reviews
      const updated = await reviewService.getReviewsByProduct(id as string);
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
       alert(t('add_to_cart_success'));
    }
  };

  if (loading) return <div style={{ padding: '10rem', textAlign: 'center' }}>{t('processing')}</div>;
  if (!product) return <div style={{ padding: '10rem', textAlign: 'center' }}>Product not found</div>;

  return (
    <div style={{ padding: '2rem 0' }}>
      <button 
        onClick={() => router.back()}
        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', fontWeight: 600 }}
      >
        <ArrowLeft size={18} /> {t('back')}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) 1fr', gap: '4rem', marginBottom: '5rem' }}>
        {/* Gallery */}
        <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
          <div className="glass-card" style={{ padding: '1rem', borderRadius: '24px', overflow: 'hidden' }}>
             <img 
               src={product.images[0]} 
               alt={product.name} 
               style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '16px' }} 
             />
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', color: '#F59E0B' }}>
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)) ? 'currentColor' : 'none'} />)}
                </div>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>({reviews.length} {t('reviews')})</span>
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.1 }}>{product.name}</h1>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>${product.price.toFixed(2)}</div>
           </div>

           <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.6 }}>{product.description}</p>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('colors')}</h4>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
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
                className="btn-neon" 
                style={{ flex: 1, padding: '1.5rem', fontSize: '1.125rem' }}
              >
                <ShoppingCart size={20} style={{ marginRight: '0.75rem' }} /> {t('add_to_cart')}
              </button>
           </div>

           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 <ShieldCheck size={20} color="#10B981" />
                 <span>Гарантия безопасности</span>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                 <Truck size={20} color="var(--primary)" />
                 <span>Экспресс доставка</span>
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
              <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Оставить отзыв</h4>
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
                placeholder="Расскажите о ваших впечатлениях от покупки..."
                style={{ width: '100%', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '12px', color: 'white', minHeight: '120px', resize: 'none', outline: 'none', marginBottom: '1.5rem' }}
              />
              <button disabled={submittingReview} type="submit" className="btn-neon" style={{ padding: '0.75rem 2rem' }}>
                {submittingReview ? 'Отправка...' : 'Опубликовать'}
              </button>
           </form>
         ) : user ? (
           <div className="glass-card" style={{ padding: '2rem', marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(138, 63, 252, 0.3)', background: 'rgba(138, 63, 252, 0.05)' }}>
              <ShieldCheck size={24} color="var(--primary)" />
              <div style={{ fontSize: '0.9rem' }}>
                 Отзывы могут оставлять только проверенные покупатели, которые приобрели данный товар.
              </div>
           </div>
         ) : (
           <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '4rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>Войдите в аккаунт, чтобы оставить отзыв</p>
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
                 Отзывов пока нет. Будьте первым!
              </div>
            )}
         </div>
      </div>
    </div>
  );
}
