#!/usr/bin/env node

import fs from 'fs';

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
    
    // Parse the JSON
    const data = JSON.parse(content);
    
    // Already valid - skip
    fixed++;
    console.log(`✅ ${file} - already valid`);
  } catch (parseError) {
    // File has issues, need to fix
    console.log(`🔧 Fixing ${file}...`);
    
    try {
      let content = fs.readFileSync(file, 'utf-8');
      
      // Fix English contractions
      content = content.replace(/I"ve/g, "I've");
      content = content.replace(/Can"t/g, "Can't");
      content = content.replace(/can"t/g, "can't");
      content = content.replace(/Don"t/g, "Don't");
      content = content.replace(/don"t/g, "don't");
      content = content.replace(/doesn"t/g, "doesn't");
      content = content.replace(/I"m/g, "I'm");
      content = content.replace(/won"t/g, "won't");
      content = content.replace(/it"s/g, "it's");
      content = content.replace(/that"s/g, "that's");
      
      // Now replace ALL remaining " within string values with 「 and 」 alternately
      // We do this by processing line by line
      const lines = content.split('\n');
      const fixedLines = lines.map(line => {
        // Skip lines that are just JSON structure (like {, }, [, ])
        if (line.trim().match(/^[\{\}\[\],]$/)) {
          return line;
        }
        
        // For lines with field: "value", fix quotes inside value
        const match = line.match(/^(\s*"[^"]+"\s*:\s*")(.*)("[\s,]*)$/);
        if (match) {
          const prefix = match[1];  // '  "field": "'
          let value = match[2];     // the value content
          const suffix = match[3];  // '",' or '"'
          
          // Replace quotes in value with 「」 alternately
          let inQuote = false;
          let result = '';
          for (let i = 0; i < value.length; i++) {
            if (value[i] === '"') {
              result += inQuote ? '」' : '「';
              inQuote = !inQuote;
            } else {
              result += value[i];
            }
          }
          
          return prefix + result + suffix;
        }
        
        return line;
      });
      
      content = fixedLines.join('\n');
      
      // Validate
      try {
        JSON.parse(content);
        fs.writeFileSync(file, content, 'utf-8');
        fixed++;
        console.log(`  ✅ Fixed and validated`);
      } catch (e) {
        console.log(`  ❌ Still invalid: ${e.message.substring(0, 60)}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

console.log(`\n✅ Valid ${fixed} / ${files.length} files`);
