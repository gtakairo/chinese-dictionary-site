#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let fixedCount = 0;
let alreadyValid = 0;

console.log('🔧 Fixing quotes in JSON files...\n');

for (const lang of LANGUAGES) {
  const langDir = path.join(DATA_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    continue;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  console.log(`📁 Processing ${lang}/ (${files.length} files)...`);
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Check if already valid
      try {
        JSON.parse(content);
        alreadyValid++;
        continue;
      } catch (e) {
        // Need to fix
      }
      
      // Strategy: Replace bare " inside string values with 「」
      // We need to be careful to only replace quotes inside values, not structure
      
      // Find patterns like: "value with " inside"
      // Replace the middle " with 「 or 」 alternately
      
      // Simpler approach: Replace " that appears after : and before , or }
      // Pattern: ": "...text with " here..." 
      
      // Actually, let's just replace ALL " that are NOT:
      // 1. At the start of a key/value (after { [ , :)
      // 2. At the end of a key/value (before : , } ])
      
      // Even simpler: Replace " characters that appear in the middle of words
      // Pattern: [a-zA-Z]"[a-zA-Z] -> [a-zA-Z]'[a-zA-Z]
      
      // Replace contractions and possessives
      content = content.replace(/([a-zA-Z])"([tmsdlvre])\b/g, "$1'$2");
      content = content.replace(/([a-zA-Z])"ll\b/g, "$1'll");
      content = content.replace(/\bI"m\b/g, "I'm");
      content = content.replace(/\b([a-zA-Z]+)n"t\b/gi, "$1n't");
      
      // Try to parse
      try {
        JSON.parse(content);
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
      } catch (e) {
        // Still invalid - more aggressive fix needed
        // Replace remaining " in the middle of text with 「」
        const lines = content.split('\n');
        const fixed = lines.map(line => {
          // If this is a line with a string value containing quotes
          if (line.includes('": "') && line.match(/": ".*".*"/)) {
            // Find the value part
            const match = line.match(/(.*": ")(.*)(".*)/);
            if (match) {
              const prefix = match[1];
              let value = match[2];
              const suffix = match[3];
              
              // Replace " in the value part with 「 or 」 alternately
              let useLeft = true;
              value = value.replace(/"/g, () => {
                const result = useLeft ? '「' : '」';
                useLeft = !useLeft;
                return result;
              });
              
              line = prefix + value + suffix;
            }
          }
          return line;
        }).join('\n');
        
        try {
          JSON.parse(fixed);
          fs.writeFileSync(filePath, fixed, 'utf-8');
          fixedCount++;
        } catch (e2) {
          console.log(`❌ ${lang}/${file}: ${e2.message.substring(0, 60)}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ Error reading ${lang}/${file}`);
    }
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`✅ Fixed: ${fixedCount}`);
console.log(`✓  Already valid: ${alreadyValid}`);
console.log(`${'='.repeat(60)}\n`);
