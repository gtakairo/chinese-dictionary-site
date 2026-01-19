#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const LANGUAGES = ['en', 'ja', 'ko', 'th'];

let fixedCount = 0;

console.log('🔧 Fixing remaining JSON files with sed...\n');

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

// Fix each invalid file with sed
for (const filePath of invalidFiles) {
  try {
    // Create sed commands for common patterns
    const sedCommands = [
      's/I"m/I\'m/g',
      's/I"ve/I\'ve/g',
      's/I"d/I\'d/g',
      's/I"ll/I\'ll/g',
      's/you"re/you\'re/g',
      's/You"re/You\'re/g',
      's/you"ve/you\'ve/g',
      's/you"d/you\'d/g',
      's/you"ll/you\'ll/g',
      's/he"s/he\'s/g',
      's/He"s/He\'s/g',
      's/she"s/she\'s/g',
      's/She"s/She\'s/g',
      's/it"s/it\'s/g',
      's/It"s/It\'s/g',
      's/we"re/we\'re/g',
      's/We"re/We\'re/g',
      's/we"ve/we\'ve/g',
      's/they"re/they\'re/g',
      's/They"re/They\'re/g',
      's/they"ve/they\'ve/g',
      's/that"s/that\'s/g',
      's/That"s/That\'s/g',
      's/there"s/there\'s/g',
      's/There"s/There\'s/g',
      's/what"s/what\'s/g',
      's/What"s/What\'s/g',
      's/who"s/who\'s/g',
      's/Who"s/Who\'s/g',
      's/where"s/where\'s/g',
      's/when"s/when\'s/g',
      's/how"s/how\'s/g',
      's/don"t/don\'t/g',
      's/Don"t/Don\'t/g',
      's/doesn"t/doesn\'t/g',
      's/Doesn"t/Doesn\'t/g',
      's/didn"t/didn\'t/g',
      's/Didn"t/Didn\'t/g',
      's/won"t/won\'t/g',
      's/Won"t/Won\'t/g',
      's/wouldn"t/wouldn\'t/g',
      's/Wouldn"t/Wouldn\'t/g',
      's/can"t/can\'t/g',
      's/Can"t/Can\'t/g',
      's/couldn"t/couldn\'t/g',
      's/Couldn"t/Couldn\'t/g',
      's/shouldn"t/shouldn\'t/g',
      's/Shouldn"t/Shouldn\'t/g',
      's/mustn"t/mustn\'t/g',
      's/needn"t/needn\'t/g',
      's/haven"t/haven\'t/g',
      's/Haven"t/Haven\'t/g',
      's/hasn"t/hasn\'t/g',
      's/Hasn"t/Hasn\'t/g',
      's/hadn"t/hadn\'t/g',
      's/Hadn"t/Hadn\'t/g',
      's/wasn"t/wasn\'t/g',
      's/Wasn"t/Wasn\'t/g',
      's/weren"t/weren\'t/g',
      's/Weren"t/Weren\'t/g',
      's/isn"t/isn\'t/g',
      's/Isn"t/Isn\'t/g',
      's/aren"t/aren\'t/g',
      's/Aren"t/Aren\'t/g',
      's/ain"t/ain\'t/g',
      's/let"s/let\'s/g',
      's/Let"s/Let\'s/g',
      // Fix numbers
      's/\\([0-9]\\)"\\([0-9]\\)/\\1\\2/g',
    ];
    
    const sedCommand = sedCommands.join('; ');
    execSync(`sed -i '${sedCommand}' "${filePath}"`, { encoding: 'utf-8' });
    
    // Verify if fixed
    const content = fs.readFileSync(filePath, 'utf-8');
    try {
      JSON.parse(content);
      fixedCount++;
      console.log(`✅ Fixed: ${path.relative(DATA_DIR, filePath)}`);
    } catch (e) {
      console.log(`❌ Still invalid: ${path.relative(DATA_DIR, filePath)} - ${e.message.substring(0, 60)}`);
    }
    
  } catch (error) {
    console.log(`❌ Error processing: ${path.relative(DATA_DIR, filePath)} - ${error.message}`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`\n✅ Fixed: ${fixedCount} / ${invalidFiles.length}`);
console.log(`❌ Still invalid: ${invalidFiles.length - fixedCount}`);
console.log(`\n${'='.repeat(60)}`);
