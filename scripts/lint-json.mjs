#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let totalFiles = 0;
let validFiles = 0;
let invalidFiles = 0;
const errors = [];

function validateJsonFile(filePath, lang, filename) {
  totalFiles++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.trim().length === 0) {
      invalidFiles++;
      errors.push({
        lang,
        file: filename,
        error: 'Empty file',
        path: filePath,
      });
      return false;
    }
    
    const data = JSON.parse(content);
    
    const requiredFields = ['slug', 'chinese', 'pinyin', 'meaning'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      invalidFiles++;
      errors.push({
        lang,
        file: filename,
        error: `Missing required fields: ${missingFields.join(', ')}`,
        path: filePath,
      });
      return false;
    }
    
    const expectedSlug = filename.replace('.json', '');
    if (data.slug !== expectedSlug) {
      errors.push({
        lang,
        file: filename,
        error: `Slug mismatch: expected "${expectedSlug}", got "${data.slug}"`,
        path: filePath,
        severity: 'warning',
      });
    }
    
    validFiles++;
    return true;
    
  } catch (error) {
    invalidFiles++;
    errors.push({
      lang,
      file: filename,
      error: error.message,
      path: filePath,
    });
    return false;
  }
}

function validateLanguage(lang) {
  const langDir = path.join(DATA_DIR, lang);
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  Language directory not found: ${lang}`);
    return;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  console.log(`\n📁 Checking ${lang}/ (${files.length} files)`);
  
  for (const file of files) {
    const filePath = path.join(langDir, file);
    validateJsonFile(filePath, lang, file);
  }
}

function main() {
  console.log('🔍 JSON Lint Checker for Chinese Dictionary Data\n');
  console.log('='.repeat(60));
  
  for (const lang of LANGUAGES) {
    validateLanguage(lang);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Summary:');
  console.log(`   Total files: ${totalFiles}`);
  console.log(`   ✅ Valid: ${validFiles}`);
  console.log(`   ❌ Invalid: ${invalidFiles}`);
  
  if (errors.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('\n❌ Errors found:\n');
    
    const criticalErrors = errors.filter(e => e.severity !== 'warning');
    const warnings = errors.filter(e => e.severity === 'warning');
    
    if (criticalErrors.length > 0) {
      console.log('🔴 Critical Errors:');
      criticalErrors.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.lang}/${err.file}`);
        console.log(`   Error: ${err.error}`);
        console.log(`   Path: ${err.path}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      warnings.forEach((err, i) => {
        console.log(`\n${i + 1}. ${err.lang}/${err.file}`);
        console.log(`   Warning: ${err.error}`);
      });
    }
    
    const reportPath = path.join(DATA_DIR, '_meta', 'lint-report.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({ 
      timestamp: new Date().toISOString(),
      summary: { totalFiles, validFiles, invalidFiles },
      errors: errors 
    }, null, 2));
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
    process.exit(1);
  } else {
    console.log('\n✅ All JSON files are valid!');
    process.exit(0);
  }
}

main();
