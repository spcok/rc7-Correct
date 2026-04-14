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

console.log('🚀 Finalizing modular database rewire...');
const files = walk(srcDir);
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 1. Redirect collection imports from old database.ts to new modular index
  if (content.includes('../../lib/database') || content.includes('../lib/database')) {
    content = content.replace(/from\s+['"].*\/lib\/database['"];?/g, "from '@/lib/db';");
    changed = true;
  }

  // 2. Ensure we use the correct React-specific hook for v0.6
  if (content.includes("from '@tanstack/db'") && content.includes("useStore")) {
    content = content.replace(
      /import\s+\{\s*useStore\s*\}\s+from\s+['"]@tanstack\/db['"];?/g,
      "import { useLiveQuery } from '@tanstack/react-db';"
    );
    // Replace variable usage
    content = content.replace(/useStore\(/g, "useLiveQuery(");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ Fixed: ${file.replace(srcDir, '')}`);
    updatedCount++;
  }
});

console.log(`\n🎉 Hook Rewire Complete! Updated ${updatedCount} files.`);
