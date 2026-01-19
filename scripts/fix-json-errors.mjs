#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');

const fixes = [];

/**
 * Fix a single JSON file
 */
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Skip empty files
    if (content.trim().length === 0) {
      fixes.push({
        file: filePath,
        action: 'SKIPPED - Empty file (needs manual fix)',
      });
      return false;
    }
    
    let data = JSON.parse(content);
    let modified = false;
    
    // Fix empty meaning - mark for manual translation
    if (!data.meaning || data.meaning.trim() === '') {
      data.meaning = `[NEEDS TRANSLATION]`;
      modified = true;
    }
    
    // Fix empty pinyin - mark for manual fix
    if (!data.pinyin || data.pinyin.trim() === '') {
      data.pinyin = `[NEEDS PINYIN]`;
      modified = true;
    }
    
    // Fix empty description
    if (data.description === '') {
      delete data.description;
      modified = true;
    }
    
    // Fix empty arrays
    if (data.examples && data.examples.length === 0) {
      delete data.examples;
      modified = true;
    }
    
    if (data.relatedWords && data.relatedWords.length === 0) {
      delete data.relatedWords;
      modified = true;
    }
    
    if (modified) {
      // Write back with proper formatting
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
      fixes.push({
        file: filePath,
        action: 'FIXED - Added placeholder for missing fields',
      });
      return true;
    }
    
    return false;
    
  } catch (error) {
    fixes.push({
      file: filePath,
      action: `ERROR - ${error.message}`,
    });
    return false;
  }
}

/**
 * Fix all JSON files with errors
 */
function main() {
  console.log('🔧 Fixing JSON files with errors...\n');
  
  const errorFiles = [
    'en/anpaishang.json',
    'en/bitebi.json',
    'en/fanchameng.json',
    'en/fanersai.json',
    'en/fanquan.json',
    'en/ku.json',
    'en/lacai.json',
    'en/neiweir.json',
    'en/neiyu.json',
    'en/nitian.json',
    'en/nvshen.json',
    'en/pua.json',
    'en/qiushengyu.json',
    'en/ruanmeng.json',
    'en/ruanwen.json',
    'en/shangresou.json',
    'en/sheniu.json',
    'en/shuaexist.json',
    'en/shuangbiao.json',
    'en/shuanq.json',
    'en/tangying.json',
    'en/tuikeng.json',
    'en/tuofen.json',
    'en/weikuanren.json',
    'en/wuyuzi.json',
    'en/xianyu.json',
    'en/xiaozuowen.json',
    'en/yankong.json',
    'en/yanzhi.json',
    'en/yeqinghui.json',
    'en/yinghe.json',
    'en/zhainan.json',
    'en/zhalie.json',
  ];
  
  for (const file of errorFiles) {
    const filePath = path.join(DATA_DIR, file);
    if (fs.existsSync(filePath)) {
      fixFile(filePath);
    } else {
      fixes.push({
        file: filePath,
        action: 'NOT FOUND',
      });
    }
  }
  
  // Print results
  console.log('\n📊 Fix Results:\n');
  fixes.forEach((fix, index) => {
    const relativePath = path.relative(DATA_DIR, fix.file);
    console.log(`${index + 1}. ${relativePath}`);
    console.log(`   ${fix.action}\n`);
  });
  
  console.log('='.repeat(60));
  console.log(`\n✅ Processed ${fixes.length} files`);
  console.log('\n⚠️  Files marked with [NEEDS TRANSLATION] or [NEEDS PINYIN] require manual fixes.\n');
}

main();
