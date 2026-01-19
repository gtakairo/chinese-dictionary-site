#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let fixedCount = 0;

console.log('🔧 Fixing JSON files with pure string replacement...\n');

// Get list of invalid files
const invalidFiles = [];

for (const lang of LANGUAGES) {
  const langDir = path.join(DATA_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    continue;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      JSON.parse(content);
    } catch (e) {
      invalidFiles.push(filePath);
    }
  }
}

console.log(`Found ${invalidFiles.length} invalid files to fix\n`);

// Fix each invalid file with pure string replacement
for (const filePath of invalidFiles) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Replace all problematic quote patterns
    // Word"t patterns
    content = content.replace(/([a-z]+)n"t/gi, "$1n't");
    // Word"s patterns
    content = content.replace(/([a-z]+)"s\b/gi, "$1's");
    // Word"re patterns
    content = content.replace(/([a-z]+)"re\b/gi, "$1're");
    // Word"ve patterns  
    content = content.replace(/([a-z]+)"ve\b/gi, "$1've");
    // Word"d patterns
    content = content.replace(/([a-z]+)"d\b/gi, "$1'd");
    // Word"ll patterns
    content = content.replace(/([a-z]+)"ll\b/gi, "$1'll");
    // I"m pattern
    content = content.replace(/I"m\b/g, "I'm");
    
    // Numbers
    content = content.replace(/([0-9])"([0-9])/g, "$1$2");
    
    // Try to parse
    try {
      JSON.parse(content);
      
      // Success!
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
        console.log(`✅ Fixed: ${path.relative(DATA_DIR, filePath)}`);
      }
    } catch (e) {
      console.log(`❌ Still invalid: ${path.relative(DATA_DIR, filePath)} - ${e.message.substring(0, 60)}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${path.relative(DATA_DIR, filePath)} - ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Fixed: ${fixedCount} / ${invalidFiles.length}`);
console.log(`❌ Still invalid: ${invalidFiles.length - fixedCount}`);
console.log(`${'='.repeat(60)}\n`);
