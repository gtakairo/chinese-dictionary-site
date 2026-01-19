#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const files = [
  'data/en/hua.json',
  'data/en/ju.json',
  'data/en/jueju.json',
  'data/en/lai.json',
  'data/en/miao.json',
  'data/ja/geng.json',
  'data/ja/jie.json',
  'data/ja/lu.json',
  'data/ja/mai.json',
  'data/ja/shanggan.json',
  'data/ja/shuaiguo.json',
  'data/ja/si.json',
  'data/ja/zhenxiang.json',
  'data/ja/zhong.json',
  'data/ko/chi.json',
  'data/ko/gun.json',
  'data/ko/guo.json',
  'data/ko/jiucai.json',
  'data/ko/ju.json',
  'data/ko/jueju.json',
  'data/ko/kelian.json',
  'data/th/jueju.json',
];

let fixed = 0;

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Replace 「 and 」 back with " in the content
    // But only in places where they were incorrectly placed
    // These appear in \「...\」 patterns within escape sequences
    
    // Pattern: \「 -> \" and 」 -> " 
    content = content.replace(/\\「/g, '\\"');
    content = content.replace(/」/g, '"');
    content = content.replace(/「/g, '"');
    
    // Also fix common patterns
    content = content.replace(/""([a-zA-Z])/g, '"$1');
    
    // Try to parse
    try {
      JSON.parse(content);
      fs.writeFileSync(file, content, 'utf-8');
      fixed++;
      console.log(`✅ Fixed: ${file}`);
    } catch (e) {
      console.log(`❌ Still invalid: ${file} - ${e.message.substring(0, 60)}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${file}`);
  }
}

console.log(`\n✅ Fixed ${fixed} / ${files.length} files`);
