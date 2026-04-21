"use client";

import React, { useState } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { contactService } from '@/lib/services/contactService';

interface Props { onClose: () => void; }

export function ContactModal({ onClose }: Props) {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    if (!subject.trim() || !message.trim()) return;

    setLoading(true);
    try {
      await contactService.sendMessage({
        senderUid: user.uid,
        senderEmail: user.email || '',
        senderName: profile.displayName || user.email || 'Unknown',
        senderRole: (profile.role === 'seller' ? 'seller' : 'client') as 'client' | 'seller',
        subject: subject.trim(),
        message: message.trim(),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
    borderRadius: '12px', color: 'white', outline: 'none', fontSize: '0.9rem',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={20} />
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{t('contact_sent_title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('contact_sent_desc')}</p>
            <button className="btn-neon" onClick={onClose}>{t('back')}</button>
          </div>
        ) : (
          <>
            <h2 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('contact_us')}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{t('contact_desc')}</p>

            {!user ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>{t('login_to_review')}</p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '0.6rem 1rem', background: 'rgba(138,63,252,0.08)', border: '1px solid rgba(138,63,252,0.2)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {t('from_label')}: <span style={{ color: 'white', fontWeight: 600 }}>{profile?.displayName || user.email}</span>
                  <span style={{ marginLeft: '0.5rem', padding: '2px 8px', borderRadius: '20px', background: 'rgba(138,63,252,0.15)', color: 'var(--primary)', fontSize: '0.7rem', fontWeight: 700 }}>
                    {profile?.role}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t('contact_subject')}</label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)} style={inp} placeholder={t('contact_subject_placeholder')} />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>{t('contact_message')}</label>
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={5}
                    style={{ ...inp, resize: 'none' }} placeholder={t('contact_message_placeholder')} />
                </div>

                <button type="submit" disabled={loading} className="btn-neon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.85rem' }}>
                  {loading ? t('sending') : <><Send size={16} /> {t('contact_send')}</>}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
