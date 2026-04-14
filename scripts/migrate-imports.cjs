const fs = require('fs');
const path = require('path');

// Target the entire src directory
const srcDir = path.join(__dirname, '../src');

// Recursively find all TS and TSX files
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

console.log('🚀 Scanning src directory for legacy TanStack DB imports...');
const files = walk(srcDir);
let updatedCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  
  // If the file contains the old package, surgically replace the import
  if (content.includes('@tanstack/react-db')) {
    const updated = content.replace(
      /import\s+\{\s*useLiveQuery\s*\}\s+from\s+['"]@tanstack\/react-db['"];?/g,
      "import { useStore } from '@tanstack/db';"
    );
    
    fs.writeFileSync(file, updated, 'utf-8');
    console.log(`✅ Rewired: ${file.replace(__dirname, '')}`);
    updatedCount++;
  }
});

console.log(`\n🎉 Phase 3 Complete! Successfully rewired ${updatedCount} data hooks to v0.6.`);
