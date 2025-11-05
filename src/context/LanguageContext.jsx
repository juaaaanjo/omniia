import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { translations, defaultLanguage } from '../i18n';
import { AuthContext } from './AuthContext';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const auth = useContext(AuthContext);

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Priority: user.language > localStorage > default
    const userLanguage = auth?.user?.language;
    if (userLanguage && translations[userLanguage]) {
      return userLanguage;
    }
    const saved = localStorage.getItem('language');
    return saved || defaultLanguage;
  });

  const [t, setT] = useState(translations[currentLanguage]);

  // Sync language when user logs in
  useEffect(() => {
    if (auth?.user?.language && translations[auth.user.language]) {
      if (currentLanguage !== auth.user.language) {
        setCurrentLanguage(auth.user.language);
      }
    }
  }, [auth?.user?.language, currentLanguage]);

  // Update translations when language changes
  useEffect(() => {
    setT(translations[currentLanguage]);
    localStorage.setItem('language', currentLanguage);

    // Update document lang attribute
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Change language
  const changeLanguage = useCallback(async (langCode) => {
    if (translations[langCode]) {
      setCurrentLanguage(langCode);

      // Update backend if user is authenticated
      if (auth?.user && auth?.updateProfile) {
        try {
          await auth.updateProfile({ language: langCode });
        } catch (error) {
          console.error('Failed to update language preference:', error);
        }
      }
    } else {
      console.warn(`Language '${langCode}' not found, using default`);
      setCurrentLanguage(defaultLanguage);
    }
  }, [auth]);

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
