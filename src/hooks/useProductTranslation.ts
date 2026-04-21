import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';
import { translationCacheService } from '@/lib/services/translationCacheService';

interface TranslatedContent {
  name: string;
  description: string;
}

export function useProductTranslation(product: Product | null) {
  const { language } = useLanguage();

  // Initialise synchronously from L1 cache to avoid flash of untranslated content
  const getInitial = (): TranslatedContent => {
    if (!product) return { name: '', description: '' };

    // Same language — no translation needed
    if (language === 'en' && product.id.startsWith('mock-')) {
      return { name: product.name, description: product.description };
    }
    if (language === 'ru' && !product.id.startsWith('mock-')) {
      return { name: product.name, description: product.description };
    }

    // Check in-product translations first
    if (product.translations?.[language]) {
      return product.translations[language];
    }

    // L1 sync check (no network)
    const cached = translationCacheService.getSync(product.id, language);
    if (cached) return { name: cached.name, description: cached.description };

    // Fallback to original while async fetch runs
    return { name: product.name, description: product.description };
  };

  const [content, setContent] = useState<TranslatedContent>(getInitial);
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!product) return;

    // Determine if translation is needed
    const isMock = product.id.startsWith('mock-');
    const nativeEn = isMock;   // mock products are in English
    const nativeRu = !isMock;  // real DB products are in Russian

    const needsTranslation =
      (language === 'ru' && nativeEn) ||
      (language === 'en' && nativeRu);

    if (!needsTranslation) {
      setContent({ name: product.name, description: product.description });
      return;
    }

    // Check in-product translations (already in Firestore product doc)
    if (product.translations?.[language]) {
      setContent(product.translations[language]);
      return;
    }

    // Abort previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let cancelled = false;

    const run = async () => {
      // ── L1 check (sync, already done in getInitial but re-check after lang change) ──
      const l1 = translationCacheService.getSync(product.id, language);
      if (l1) {
        if (!cancelled) setContent({ name: l1.name, description: l1.description });
        return;
      }

      // ── L2 check (Firestore, async) ──
      setIsTranslating(true);
      const l2 = await translationCacheService.get(product.id, language);
      if (l2) {
        if (!cancelled) {
          setContent({ name: l2.name, description: l2.description });
          setIsTranslating(false);
        }
        return;
      }

      // ── Call translation API ──
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            description: product.description,
            targetLang: language,
          }),
        });

        if (!res.ok) throw new Error('Translation API error');
        const data = await res.json();

        if (!cancelled && data.name) {
          setContent({ name: data.name, description: data.description });

          // Save to both L1 and L2 (fire-and-forget)
          translationCacheService.set(product.id, language, data.name, data.description);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Translation failed:', err);
        }
      } finally {
        if (!cancelled) setIsTranslating(false);
      }
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [language, product?.id]);

  return { content, isTranslating };
}
