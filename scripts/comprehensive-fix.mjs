#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let fixedCount = 0;
let alreadyValidCount = 0;
let failedCount = 0;
const failedFiles = [];

function fixJsonQuotes(content) {
  let fixed = content;
  
  // Use regex-based approach to avoid encoding issues
  // Fix all word"t -> word't (contractions with n't)
  fixed = fixed.replace(/\b([a-zA-Z]+)n"t\b/gi, "$1n't");
  
  // Fix word"s -> word's (possessives and is/has contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"s\b/g, "$1's");
  
  // Fix word"re -> word're (are contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"re\b/gi, "$1're");
  
  // Fix word"ve -> word've (have contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"ve\b/gi, "$1've");
  
  // Fix word"d -> word'd (had/would contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"d\b/gi, "$1'd");
  
  // Fix word"ll -> word'll (will contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"ll\b/gi, "$1'll");
  
  // Fix word"m -> word'm (am contractions)
  fixed = fixed.replace(/\b([a-zA-Z]+)"m\b/gi, "$1'm");
  
  // Fix numbers with quotes (996.007 etc.)
  fixed = fixed.replace(/([0-9])"([0-9])/g, "$1$2");
  fixed = fixed.replace(/([0-9])\."([0-9])/g, "$1.$2");
  
  return fixed;
}

function attemptFix(filePath, lang, filename) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Try to parse first
    try {
      JSON.parse(content);
      alreadyValidCount++;
      return; // Already valid
    } catch (e) {
      // Need to fix
    }
    
    // Apply fixes
    content = fixJsonQuotes(content);
    
    // Try to parse again
    try {
      JSON.parse(content);
      
      // Success! Write back only if changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
        console.log(`✅ Fixed: ${lang}/${filename}`);
      } else {
        alreadyValidCount++;
      }
    } catch (e2) {
      failedCount++;
      failedFiles.push({
        file: `${lang}/${filename}`,
        error: e2.message,
        path: filePath,
        position: e2.message.match(/position (\d+)/)?.[1] || 'unknown'
      });
      console.log(`❌ Could not fix: ${lang}/${filename} - ${e2.message.substring(0, 80)}`);
    }
    
  } catch (error) {
    failedCount++;
    failedFiles.push({
      file: `${lang}/${filename}`,
      error: error.message,
      path: filePath
    });
  }
}

console.log('🔧 Starting comprehensive JSON fix...\n');

for (const lang of LANGUAGES) {
  const langDir = path.join(DATA_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  Directory not found: ${lang}/`);
    continue;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  console.log(`📁 Checking ${lang}/ (${files.length} files)...`);
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    attemptFix(filePath, lang, file);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n📊 Fix Results:\n');
console.log(`✅ Fixed: ${fixedCount}`);
console.log(`✓  Already valid: ${alreadyValidCount}`);
console.log(`❌ Failed to fix: ${failedCount}`);

if (failedFiles.length > 0 && failedFiles.length <= 30) {
  console.log('\n❌ Files that need manual attention:\n');
  failedFiles.forEach((item, i) => {
    console.log(`${i + 1}. ${item.file}`);
    console.log(`   Position: ${item.position}`);
    console.log(`   Error: ${item.error.substring(0, 100)}`);
    console.log();
  });
} else if (failedFiles.length > 30) {
  console.log('\n❌ Too many failed files. Writing to failed-files.txt...');
  const output = failedFiles.map((item, i) => 
    `${i + 1}. ${item.file}\n   Position: ${item.position}\n   Error: ${item.error}\n`
  ).join('\n');
  fs.writeFileSync(path.join(__dirname, 'failed-files.txt'), output);
}

console.log('\n' + '='.repeat(60));
