import fs from 'node:fs';
import path from 'node:path';

export interface WordEntry {
  slug: string;
  chinese: string;
  pinyin: string;
  category: string;
  meaning: string;
  etymology: string;
  usage: string;
  examples: Array<{
    chinese: string;
    pinyin: string;
    translation: string;
  }>;
  related: string[];
}

const DATA_DIR = path.join(process.cwd(), '..', 'data');

/**
 * Get all words for a specific language
 */
export function getAllWords(lang: string): WordEntry[] {
  const langDir = path.join(DATA_DIR, lang);

  if (!fs.existsSync(langDir)) {
    return [];
  }

  const files = fs.readdirSync(langDir).filter((f) => f.endsWith('.json'));

  const words: WordEntry[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(langDir, file), 'utf-8');
      const word = JSON.parse(content) as WordEntry;
      words.push(word);
    } catch (error) {
      // Skip invalid JSON files
      console.warn(
        `Warning: Failed to parse ${file}:`,
        error instanceof Error ? error.message : error
      );
    }
  }

  return words;
}

/**
 * Get a single word by slug
 */
export function getWordBySlug(lang: string, slug: string): WordEntry | null {
  const filePath = path.join(DATA_DIR, lang, `${slug}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as WordEntry;
}

/**
 * Get words by category
 */
export function getWordsByCategory(lang: string, category: string): WordEntry[] {
  return getAllWords(lang).filter((word) => word.category === category);
}

/**
 * Get available languages
 */
export function getAvailableLanguages(): string[] {
  return ['en', 'ja', 'ko', 'th'];
}

/**
 * Get all categories
 */
export interface Category {
  id: string;
  ja: string;
  en: string;
  ko: string;
  th: string;
  wordCount: number;
  icon: string;
}

export function getAllCategories(): Category[] {
  const metaPath = path.join(DATA_DIR, '_meta', 'categories.json');

  if (!fs.existsSync(metaPath)) {
    // Return default categories if meta file doesn't exist
    return [
      {
        id: 'net',
        ja: 'ネットスラング',
        en: 'Internet Slang',
        ko: '인터넷 슬랭',
        th: 'ศัพท์อินเทอร์เน็ต',
        wordCount: 0,
        icon: '💬',
      },
      {
        id: 'jinrong',
        ja: '金融用語',
        en: 'Finance',
        ko: '금융 용어',
        th: 'การเงิน',
        wordCount: 0,
        icon: '💰',
      },
      {
        id: 'sns',
        ja: 'SNS用語',
        en: 'Social Media',
        ko: 'SNS 용어',
        th: 'โซเชียลมีเดีย',
        wordCount: 0,
        icon: '📱',
      },
      {
        id: 'tanci',
        ja: '感嘆詞',
        en: 'Interjections',
        ko: '감탄사',
        th: 'คำอุทาน',
        wordCount: 0,
        icon: '😮',
      },
    ];
  }

  const content = fs.readFileSync(metaPath, 'utf-8');
  const data = JSON.parse(content);

  // Handle both { categories: [...] } and [...] formats
  const categoriesArray = Array.isArray(data) ? data : data.categories;

  return categoriesArray.map(
    (cat: { slug: string; ja: string; en: string; ko: string; th: string; count: number }) => ({
      id: cat.slug,
      ja: cat.ja,
      en: cat.en,
      ko: cat.ko,
      th: cat.th,
      wordCount: cat.count || 0,
      icon: getCategoryIcon(cat.slug),
    })
  );
}

/**
 * Get category name by language
 */
export function getCategoryName(category: Category, lang: string): string {
  return category[lang as keyof Pick<Category, 'ja' | 'en' | 'ko' | 'th'>] || category.en;
}

/**
 * Get the icon for a category
 */
const CATEGORY_ICONS: Record<string, string> = {
  net: '💬',
  jinrong: '💰',
  sns: '📱',
  tanci: '😮',
  chenyu: '📖',
  liuxing: '🔥',
  youxi: '🎮',
  chuanmei: '📺',
  zhengzhi: '🏛️',
  aiqing: '❤️',
};

export function getCategoryIcon(categoryId: string): string {
  return CATEGORY_ICONS[categoryId] || '📂';
}
