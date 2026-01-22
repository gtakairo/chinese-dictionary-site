/**
 * Cleanup script for devichan data
 * Removes unwanted prefixes from pinyin and translations
 */

import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data', 'ja');

// Get all devichan files
const files = fs.readdirSync(DATA_DIR).filter(f => f.startsWith('devichan-'));

let updated = 0;

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let modified = false;

  // Clean pinyin - remove "ピンイン：" prefix
  if (data.pinyin && data.pinyin.includes('ピンイン：')) {
    data.pinyin = data.pinyin.replace(/^ピンイン[：:]\s*/i, '').trim();
    modified = true;
  }

  // Clean examples - remove "和訳：" prefix from translations
  if (data.examples && Array.isArray(data.examples)) {
    for (const ex of data.examples) {
      if (ex.translation && ex.translation.includes('和訳：')) {
        ex.translation = ex.translation.replace(/^和訳[：:]\s*/i, '').trim();
        modified = true;
      }
    }
  }

  // Rename "japanese" to "translation" if exists
  if (data.examples && Array.isArray(data.examples)) {
    for (const ex of data.examples) {
      if (ex.japanese && !ex.translation) {
        ex.translation = ex.japanese;
        delete ex.japanese;
        modified = true;
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    updated++;
    console.log(`Updated: ${file}`);
  }
}

console.log(`\nTotal updated: ${updated}/${files.length}`);
