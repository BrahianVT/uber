"use client";

import React, { createContext, useState, useContext, useMemo } from 'react';
import enDictionary from './dictionaries/en.json';
import esDictionary from './dictionaries/es.json';

type Locale = 'en' | 'es';

const dictionaries = {
  en: enDictionary,
  es: esDictionary,
};

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  dictionary: typeof enDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Locale>('es');

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      dictionary: dictionaries[language],
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
