"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations } from '../lib/i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ru',
  setLanguage: () => {},
  t: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof translations['en'], variables?: Record<string, string | number>): string => {
    let text = translations[language][key] || translations['en'][key] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([vKey, vValue]) => {
        text = text.replace(`{${vKey}}`, vValue.toString());
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
