import { createContext, useState, useEffect, useCallback } from 'react';
import { translations, defaultLanguage } from '../i18n';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Get language from localStorage or use default
    const saved = localStorage.getItem('language');
    return saved || defaultLanguage;
  });

  const [t, setT] = useState(translations[currentLanguage]);

  // Update translations when language changes
  useEffect(() => {
    setT(translations[currentLanguage]);
    localStorage.setItem('language', currentLanguage);

    // Update document lang attribute
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Change language
  const changeLanguage = useCallback((langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);
    } else {
      console.warn(`Language '${langCode}' not found, using default`);
      setCurrentLanguage(defaultLanguage);
    }
  }, []);

  // Get nested translation with dot notation (e.g., 'auth.login')
  const translate = useCallback((key, replacements = {}) => {
    const keys = key.split('.');
    let value = t;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found`);
        return key;
      }
    }

    // Handle array values (like suggestions)
    if (Array.isArray(value)) {
      return value;
    }

    // Handle string replacements (e.g., {min}, {max})
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, key) => {
        return replacements[key] !== undefined ? replacements[key] : match;
      });
    }

    return value;
  }, [t]);

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    translate,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
