const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

console.log('🧹 Cleaning up redundant alias paths...');
const files = walk(srcDir);
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('@/src/')) {
    content = content.replace(/@\/src\//g, '@/');
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ Cleaned: ${file.replace(srcDir, '')}`);
    fixedCount++;
  }
});

console.log(`\n🎉 Path Cleanup Complete! Fixed ${fixedCount} files.`);
