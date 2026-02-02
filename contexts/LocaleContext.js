import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Import translations
import ruTranslations from '../locales/ru/common.json';
import enTranslations from '../locales/en/common.json';

const translations = {
  ru: ruTranslations,
  en: enTranslations,
};

const LocaleContext = createContext(undefined);

export function LocaleProvider({ children, defaultLocale = 'ru' }) {
  const [locale, setLocale] = useState(defaultLocale);

  // Load saved locale from localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    }
  }, []);

  // Save locale changes
  const changeLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocale(newLocale);
      localStorage.setItem('locale', newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  // Translation function with nested key support
  const t = useCallback((key, params = {}) => {
    const keys = key.split('.');
    let value = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations.en;
        for (const k2 of keys) {
          if (value && typeof value === 'object' && k2 in value) {
            value = value[k2];
          } else {
            return key; // Return key if not found
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      return key;
    }

    // Replace parameters
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }, [locale]);

  const value = {
    locale,
    setLocale: changeLocale,
    t,
    locales: Object.keys(translations),
  };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

export function useTranslation() {
  const { t } = useLocale();
  return { t };
}

export default LocaleContext;
