#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const LANGUAGES = ['en', 'ja', 'ko', 'th'];
const errors = [];
const warnings = [];
let totalFiles = 0;
let validFiles = 0;

/**
 * Validate a single JSON file
 */
function validateFile(filePath, lang) {
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file is empty
    if (content.trim().length === 0) {
      errors.push({
        file: filePath,
        error: 'Empty file',
      });
      return false;
    }
    
    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(content);
    } catch (parseError) {
      errors.push({
        file: filePath,
        error: `JSON parse error: ${parseError.message}`,
      });
      return false;
    }
    
    // Validate required fields
    const requiredFields = ['slug', 'chinese', 'pinyin', 'meaning', 'category'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      errors.push({
        file: filePath,
        error: `Missing required fields: ${missingFields.join(', ')}`,
      });
      return false;
    }
    
    // Validate field types
    if (typeof data.slug !== 'string') {
      errors.push({
        file: filePath,
        error: 'Field "slug" must be a string',
      });
      return false;
    }
    
    if (typeof data.chinese !== 'string') {
      errors.push({
        file: filePath,
        error: 'Field "chinese" must be a string',
      });
      return false;
    }
    
    if (typeof data.pinyin !== 'string') {
      errors.push({
        file: filePath,
        error: 'Field "pinyin" must be a string',
      });
      return false;
    }
    
    if (typeof data.meaning !== 'string') {
      errors.push({
        file: filePath,
        error: 'Field "meaning" must be a string',
      });
      return false;
    }
    
    // Validate examples if present
    if (data.examples && !Array.isArray(data.examples)) {
      errors.push({
        file: filePath,
        error: 'Field "examples" must be an array',
      });
      return false;
    }
    
    if (data.examples) {
      for (let i = 0; i < data.examples.length; i++) {
        const example = data.examples[i];
        if (!example.chinese || !example.translation) {
          warnings.push({
            file: filePath,
            warning: `Example ${i} missing chinese or translation`,
          });
        }
      }
    }
    
    // Validate relatedWords if present
    if (data.relatedWords && !Array.isArray(data.relatedWords)) {
      errors.push({
        file: filePath,
        error: 'Field "relatedWords" must be an array',
      });
      return false;
    }
    
    // Check filename matches slug
    const filename = path.basename(filePath, '.json');
    if (filename !== data.slug) {
      warnings.push({
        file: filePath,
        warning: `Filename "${filename}" doesn't match slug "${data.slug}"`,
      });
    }
    
    validFiles++;
    return true;
    
  } catch (error) {
    errors.push({
      file: filePath,
      error: `Unexpected error: ${error.message}`,
    });
    return false;
  }
}

/**
 * Validate all JSON files in a language directory
 */
function validateLanguage(lang) {
  const langDir = path.join(DATA_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  Language directory not found: ${lang}`);
    return;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  console.log(`\n📁 Checking ${lang}/ (${files.length} files)...`);
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    validateFile(filePath, lang);
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 JSON Validation Started\n');
  console.log('=' .repeat(60));
  
  // Validate each language
  for (const lang of LANGUAGES) {
    validateLanguage(lang);
  }
  
  // Print results
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Validation Results:\n');
  console.log(`Total files checked: ${totalFiles}`);
  console.log(`✅ Valid files: ${validFiles}`);
  console.log(`❌ Invalid files: ${errors.length}`);
  console.log(`⚠️  Warnings: ${warnings.length}`);
  
  // Print errors
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('\n❌ ERRORS:\n');
    
    errors.forEach((err, index) => {
      const relativePath = path.relative(DATA_DIR, err.file);
      console.log(`${index + 1}. ${relativePath}`);
      console.log(`   Error: ${err.error}\n`);
    });
  }
  
  // Print warnings
  if (warnings.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  WARNINGS:\n');
    
    warnings.forEach((warn, index) => {
      const relativePath = path.relative(DATA_DIR, warn.file);
      console.log(`${index + 1}. ${relativePath}`);
      console.log(`   Warning: ${warn.warning}\n`);
    });
  }
  
  console.log('='.repeat(60));
  
  // Exit with error code if there are errors
  if (errors.length > 0) {
    console.log('\n❌ Validation failed. Please fix the errors above.\n');
    process.exit(1);
  } else {
    console.log('\n✅ All JSON files are valid!\n');
    process.exit(0);
  }
}

main();
