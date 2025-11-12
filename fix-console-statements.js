#!/usr/bin/env node

/**
 * Script to automatically add eslint-disable comments before console statements
 * that don't already have them.
 */

const fs = require('fs');
const path = require('path');

// Recursively find all .js and .jsx files in src directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Fix console statements in a file
function fixConsoleStatements(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const newLines = [];
  let modified = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prevLine = i > 0 ? lines[i - 1] : '';
    
    // Check if line contains console.log, console.error, console.warn
    const hasConsole = /\s*console\.(log|error|warn|info|debug)\s*\(/.test(line);
    
    // Check if previous line already has eslint-disable
    const prevHasDisable = /eslint-disable(-next)?-line\s+no-console/.test(prevLine);
    
    // Check if this line itself has eslint-disable as a trailing comment
    const hasInlineDisable = /\/\/\s*eslint-disable(-next)?-line\s+no-console/.test(line);
    
    if (hasConsole && !prevHasDisable && !hasInlineDisable) {
      // Get the indentation of the console line
      const indent = line.match(/^(\s*)/)[1];
      
      // Add eslint-disable comment before the console statement
      newLines.push(`${indent}// eslint-disable-next-line no-console`);
      newLines.push(line);
      modified = true;
    } else {
      newLines.push(line);
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'));
    return true;
  }
  
  return false;
}

// Main execution
const srcDir = path.join(__dirname, 'src');
console.log('Finding JavaScript files...');
const files = findFiles(srcDir);
console.log(`Found ${files.length} files to check\n`);

let fixedCount = 0;
let totalConsoleStatements = 0;

files.forEach(file => {
  const relativePath = path.relative(__dirname, file);
  const content = fs.readFileSync(file, 'utf8');
  const consoleMatches = content.match(/console\.(log|error|warn|info|debug)\s*\(/g);
  
  if (consoleMatches) {
    totalConsoleStatements += consoleMatches.length;
    const wasFixed = fixConsoleStatements(file);
    
    if (wasFixed) {
      console.log(`✅ Fixed: ${relativePath} (${consoleMatches.length} console statements)`);
      fixedCount++;
    }
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`Summary:`);
console.log(`  Total files checked: ${files.length}`);
console.log(`  Files modified: ${fixedCount}`);
console.log(`  Total console statements found: ${totalConsoleStatements}`);
console.log(`${'='.repeat(60)}`);

if (fixedCount > 0) {
  console.log('\n✨ All console statements now have ESLint disable comments!');
} else {
  console.log('\n✨ All console statements already have ESLint disable comments!');
}
