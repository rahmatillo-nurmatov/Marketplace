import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Product } from '@/types';
import { productService } from '@/lib/services/productService';

interface TranslatedContent {
  name: string;
  description: string;
}

export function useProductTranslation(product: Product | null) {
  const { language } = useLanguage();
  const [content, setContent] = useState<TranslatedContent>({
    name: product?.name || '',
    description: product?.description || ''
  });
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!product) return;

    if (language === 'ru') {
      if (product.translations?.['ru']) {
        setContent(product.translations['ru']);
      } else {
        setContent({ name: product.name, description: product.description });
      }
      return;
    }

    if (product.translations && product.translations[language]) {
      setContent(product.translations[language]);
      return;
    }

    // Otherwise, we need to translate it
    let isMounted = true;
    setIsTranslating(true);

    const performTranslation = async () => {
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            name: product.name,
            description: product.description,
            targetLang: language
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.name) {
            setContent({ name: data.name, description: data.description });
            
            // POINT 4 & 5: Save the translation to the database if it's NOT a mock product
            if (!product.id.toString().startsWith('mock-')) {
              productService.updateProduct(product.id, {
                translations: {
                  ...product.translations,
                  [language]: {
                    name: data.name,
                    description: data.description
                  }
                }
              }).catch(err => console.error('Failed to save translation to DB:', err));
            }
          }
        }
      } catch (err) {
        console.error('Translation error:', err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [language, product?.id, product?.name, product?.description, product?.translations]);

  return { content, isTranslating };
}
