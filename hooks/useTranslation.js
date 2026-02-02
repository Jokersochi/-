/**
 * Translation Hook
 * Simple i18n implementation
 */

import { useState, useEffect, createContext, useContext } from 'react';
import ruTranslations from '../locales/ru.json';
import enTranslations from '../locales/en.json';

const translations = {
  ru: ruTranslations,
  en: enTranslations,
};

const TranslationContext = createContext({});

export function TranslationProvider({ children, defaultLocale = 'ru' }) {
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    // Load locale from localStorage
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key, defaultValue = key) => {
    const keys = key.split('.');
    let value = translations[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) return defaultValue;
    }
    
    return value || defaultValue;
  };

  const value = {
    locale,
    changeLocale,
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
