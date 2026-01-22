/**
 * Translation script for devichan data
 * Translates Japanese data to English, Korean, and Thai
 *
 * Usage:
 *   node scripts/translate-devichan.mjs --lang en
 *   node scripts/translate-devichan.mjs --lang ko
 *   node scripts/translate-devichan.mjs --lang th
 *   node scripts/translate-devichan.mjs --lang all
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Parse arguments
const args = process.argv.slice(2);
const langIndex = args.indexOf('--lang');
const targetLang = langIndex !== -1 ? args[langIndex + 1] : 'all';

// Category name translations
const categoryNames = {
  net: {
    en: 'Internet Slang',
    ko: '인터넷 신조어·속어',
    th: 'ศัพท์อินเทอร์เน็ต',
  },
  chengyu: {
    en: 'Idioms & Four-Character Phrases',
    ko: '성어·사자성어',
    th: 'สำนวนจีน',
  },
};

/**
 * Get devichan files from ja directory
 */
function getDevichanFiles() {
  const jaDir = path.join(DATA_DIR, 'ja');
  return fs
    .readdirSync(jaDir)
    .filter((f) => f.startsWith('devichan-'))
    .map((f) => path.join(jaDir, f));
}

/**
 * Translate a single entry to English
 * Uses sourceEnglish for meaning when available
 */
function translateToEnglish(jaData) {
  return {
    slug: jaData.slug,
    chinese: jaData.chinese,
    pinyin: jaData.pinyin,
    meaning: jaData.sourceEnglish || jaData.meaning, // Use English if available
    description: jaData.description || '',
    examples: jaData.examples.map((ex) => ({
      chinese: ex.chinese,
      translation: ex.translation, // Keep Japanese for now, needs manual translation
    })),
    category: jaData.category,
    categoryName: categoryNames[jaData.category]?.en || jaData.categoryName,
    relatedWords: jaData.relatedWords || [],
    sourceUrl: jaData.sourceUrl,
  };
}

/**
 * Translate a single entry to Korean
 */
function translateToKorean(jaData) {
  return {
    slug: jaData.slug,
    chinese: jaData.chinese,
    pinyin: jaData.pinyin,
    meaning: jaData.meaning, // Needs translation
    description: jaData.description || '',
    examples: jaData.examples.map((ex) => ({
      chinese: ex.chinese,
      translation: ex.translation, // Needs translation
    })),
    category: jaData.category,
    categoryName: categoryNames[jaData.category]?.ko || jaData.categoryName,
    relatedWords: jaData.relatedWords || [],
    sourceUrl: jaData.sourceUrl,
  };
}

/**
 * Translate a single entry to Thai
 */
function translateToThai(jaData) {
  return {
    slug: jaData.slug,
    chinese: jaData.chinese,
    pinyin: jaData.pinyin,
    meaning: jaData.meaning, // Needs translation
    description: jaData.description || '',
    examples: jaData.examples.map((ex) => ({
      chinese: ex.chinese,
      translation: ex.translation, // Needs translation
    })),
    category: jaData.category,
    categoryName: categoryNames[jaData.category]?.th || jaData.categoryName,
    relatedWords: jaData.relatedWords || [],
    sourceUrl: jaData.sourceUrl,
  };
}

/**
 * Process translations for a target language
 */
function processLanguage(lang) {
  const files = getDevichanFiles();
  const outDir = path.join(DATA_DIR, lang);

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;

  const translateFn =
    lang === 'en'
      ? translateToEnglish
      : lang === 'ko'
        ? translateToKorean
        : translateToThai;

  for (const file of files) {
    const jaData = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const outFile = path.join(outDir, `${jaData.slug}.json`);

    if (fs.existsSync(outFile)) {
      skipped++;
      continue;
    }

    const translated = translateFn(jaData);
    fs.writeFileSync(outFile, JSON.stringify(translated, null, 2), 'utf-8');
    created++;
  }

  console.log(`${lang}: ${created} created, ${skipped} skipped`);
  return { created, skipped };
}

/**
 * Main function
 */
function main() {
  console.log('=== Devichan Translation Script ===\n');

  const languages = targetLang === 'all' ? ['en', 'ko', 'th'] : [targetLang];

  const totals = { created: 0, skipped: 0 };

  for (const lang of languages) {
    const result = processLanguage(lang);
    totals.created += result.created;
    totals.skipped += result.skipped;
  }

  console.log(`\nTotal: ${totals.created} created, ${totals.skipped} skipped`);
}

main();
