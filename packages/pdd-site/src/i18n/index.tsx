import React, { createContext, useContext, useState } from "react";
import en from "./en";
import pt from "./pt";
import { readStoredLocale, type Locale } from "./locale";

export type { Locale };

const translations = { en, pt } as const;
export type Translations = typeof en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: en,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(() =>
    readStoredLocale((key) => (typeof window === "undefined" ? null : window.localStorage.getItem(key))),
  );

  const handleSetLocale = (next: Locale) => {
    setLocale(next);
    window.localStorage.setItem("locale", next);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
