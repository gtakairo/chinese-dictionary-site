#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let fixedCount = 0;
let failedCount = 0;
const failedFiles = [];

function attemptFix(filePath, lang, filename) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    
    // Try to parse first
    try {
      JSON.parse(content);
      return; // Already valid
    } catch (e) {
      // Need to fix
    }
    
    // Strategy: Fix common patterns caused by the sed replacement
    // 1. Fix contractions like Can"t -> Can't, don"t -> don't
    content = content.replace(/([a-zA-Z])"([tmsdlvre])\b/g, "$1'$2");
    
    // 2. Fix possessives like it"s -> it's, that"s -> that's
    content = content.replace(/([a-zA-Z])"s\b/g, "$1's");
    
    // 3. Fix I"m -> I'm, you"re -> you're, we"re -> we're, I"ve -> I've
    content = content.replace(/\bI"m\b/g, "I'm");
    content = content.replace(/\bI"ve\b/g, "I've");
    content = content.replace(/\b([Yy])ou"re\b/g, "$1ou're");
    content = content.replace(/\b([Yy])ou"ve\b/g, "$1ou've");
    content = content.replace(/\b([Ww])e"re\b/g, "$1e're");
    content = content.replace(/\b([Ww])e"ve\b/g, "$1e've");
    content = content.replace(/\b([Tt])hey"re\b/g, "$1hey're");
    content = content.replace(/\b([Tt])hey"ve\b/g, "$1hey've");
    
    // 4. Fix other common contractions
    content = content.replace(/\b([Ww])ho"s\b/g, "$1ho's");
    content = content.replace(/\b([Ww])hat"s\b/g, "$1hat's");
    content = content.replace(/\b([Ww])here"s\b/g, "$1here's");
    content = content.replace(/\b([Tt])hat"s\b/g, "$1hat's");
    content = content.replace(/\b([Tt])here"s\b/g, "$1here's");
    content = content.replace(/\b([Hh])e"s\b/g, "$1e's");
    content = content.replace(/\b([Ss])he"s\b/g, "$1he's");
    
    // 5. Fix wouldn"t, couldn"t, shouldn"t, etc.
    content = content.replace(/\b([a-zA-Z]+)n"t\b/g, "$1n't");
    
    // 6. Fix numbers followed by quotes (like 996.007")
    content = content.replace(/([0-9])\."([0-9])/g, "$1.$2");
    content = content.replace(/([0-9])"([0-9])/g, "$1$2");
    
    // 4. Fix single quotes that were incorrectly replaced
    // Pattern: word" followed by another word" in the same string
    // This is a heuristic - may need refinement
    
    // Try to parse again
    try {
      JSON.parse(content);
      
      // Success! Write back only if changed
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
        console.log(`✅ Fixed: ${lang}/${filename}`);
      }
    } catch (e2) {
      // Still invalid, try more aggressive fixes
      
      // Try to load as JSON with errors and rebuild
      // This is a last resort - manually reconstruct valid JSON
      try {
        // Remove all trailing commas before closing brackets/braces
        content = content.replace(/,(\s*[\]}])/g, '$1');
        
        JSON.parse(content);
        fs.writeFileSync(filePath, content, 'utf-8');
        fixedCount++;
        console.log(`✅ Fixed (aggressive): ${lang}/${filename}`);
      } catch (e3) {
        failedCount++;
        failedFiles.push({
          file: `${lang}/${filename}`,
          error: e3.message,
          path: filePath
        });
        console.log(`❌ Could not fix: ${lang}/${filename}`);
      }
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

console.log('🔧 Starting automatic JSON fix...\n');

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
console.log(`✅ Successfully fixed: ${fixedCount}`);
console.log(`❌ Failed to fix: ${failedCount}`);

if (failedFiles.length > 0) {
  console.log('\n❌ Files that need manual attention:\n');
  failedFiles.slice(0, 20).forEach((item, i) => {
    console.log(`${i + 1}. ${item.file}`);
    console.log(`   Error: ${item.error.substring(0, 100)}`);
  });
  
  if (failedFiles.length > 20) {
    console.log(`\n... and ${failedFiles.length - 20} more files`);
  }
}

console.log('\n' + '='.repeat(60));
