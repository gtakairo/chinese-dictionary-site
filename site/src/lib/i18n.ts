import enTranslations from '../i18n/en.json';
import jaTranslations from '../i18n/ja.json';
import koTranslations from '../i18n/ko.json';
import thTranslations from '../i18n/th.json';

type Translations = typeof enTranslations;

const translations: Record<string, Translations> = {
  en: enTranslations,
  ja: jaTranslations,
  ko: koTranslations,
  th: thTranslations,
};

/**
 * Get translation for a key
 * @param lang - Language code (en, ja, ko, th)
 * @param key - Translation key (e.g., 'common.search' or 'word.meaning')
 * @returns Translated string
 */
export function t(lang: string, key: string): string {
  const langTranslations = translations[lang] || translations.en;

  // Split key by dot notation (e.g., 'common.search' -> ['common', 'search'])
  const keys = key.split('.');

  // Navigate through nested object
  let value: unknown = langTranslations;
  for (const k of keys) {
    value = (value as Record<string, unknown>)?.[k];
    if (value === undefined) {
      // Fallback to English if translation not found
      let fallbackValue: unknown = translations.en;
      for (const fallbackKey of keys) {
        fallbackValue = (fallbackValue as Record<string, unknown>)?.[fallbackKey];
      }
      value = fallbackValue;
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

/**
 * Get all translations for a language
 */
export function getTranslations(lang: string): Translations {
  return translations[lang] || translations.en;
}

/**
 * Check if a language is supported
 */
export function isLanguageSupported(lang: string): boolean {
  return lang in translations;
}
