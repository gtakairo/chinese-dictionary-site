#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const languages = ['en', 'ja', 'ko', 'th'];
let totalFixed = 0;
let totalErrors = 0;

for (const lang of languages) {
  const dir = `data/${lang}`;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  
  console.log(`\n📁 Processing ${lang}/ (${files.length} files)...`);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      
      // Try to parse - if it works, skip
      try {
        JSON.parse(content);
        continue;
      } catch (e) {
        // Needs fixing
      }
      
      // Fix English contractions with bare quotes
      const original = content;
      content = content.replace(/I"m/g, "I'm");
      content = content.replace(/I"ve/g, "I've");
      content = content.replace(/It"s/g, "It's");
      content = content.replace(/it"s/g, "it's");
      content = content.replace(/don"t/g, "don't");
      content = content.replace(/Don"t/g, "Don't");
      content = content.replace(/doesn"t/g, "doesn't");
      content = content.replace(/Can"t/g, "Can't");
      content = content.replace(/can"t/g, "can't");
      content = content.replace(/won"t/g, "won't");
      content = content.replace(/that"s/g, "that's");
      content = content.replace(/o"clock/g, "o'clock");
      
      // Now fix remaining bare " inside string values
      // Strategy: for each line with "field": "value",
      // replace bare " in value part with 「 and 」 alternately
      
      const lines = content.split('\n');
      const fixedLines = [];
      
      for (const line of lines) {
        // Match pattern: "field": "value" where value might contain bare "
        // We need to be more careful - the value part ends with an UNESCAPED "
        // and might contain escaped \" or bare "
        
        const fieldMatch = line.match(/^(\s*"[^"]+"\s*:\s*")(.*?)("\s*,?\s*)$/);
        if (fieldMatch) {
          const prefix = fieldMatch[1];
          let value = fieldMatch[2];
          const suffix = fieldMatch[3];
          
          // Replace bare " (not \") in value with 「」 alternately
          if (value.includes('"') && !value.includes('\\"')) {
            // Simple case: only bare quotes, no escaped quotes
            let openQuote = true;
            let result = '';
            for (let i = 0; i < value.length; i++) {
              if (value[i] === '"') {
                result += openQuote ? '「' : '」';
                openQuote = !openQuote;
              } else {
                result += value[i];
              }
            }
            fixedLines.push(prefix + result + suffix);
          } else {
            fixedLines.push(line);
          }
        } else {
          fixedLines.push(line);
        }
      }
      
      content = fixedLines.join('\n');
      
      // Validate
      try {
        JSON.parse(content);
        if (content !== original) {
          fs.writeFileSync(filePath, content, 'utf-8');
          console.log(`  ✅ ${file}`);
          totalFixed++;
        }
      } catch (e) {
        console.log(`  ❌ ${file}: ${e.message.substring(0, 60)}`);
        totalErrors++;
      }
    } catch (error) {
      console.log(`  ❌ ${file}: ${error.message}`);
      totalErrors++;
    }
  }
}

console.log(`\n============================================================`);
console.log(`✅ Fixed: ${totalFixed} files`);
console.log(`❌ Errors: ${totalErrors} files`);
console.log(`============================================================`);
