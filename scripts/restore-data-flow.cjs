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

console.log('🔄 Restoring data flow queries to v0.6 syntax...');
const files = walk(srcDir);
let fixedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // 1. Convert: useLiveQuery(animalsCollection) 
  //    To: const { data: animals = [] } = useLiveQuery((q) => q.from({ data: animalsCollection })); return animals;
  // This regex targets hooks specifically to maintain their return value signature
  const hookRegex = /useLiveQuery\s*\(\s*([a-zA-Z0-9_]+Collection)\s*\)/g;
  
  if (hookRegex.test(content)) {
    content = content.replace(hookRegex, (match, collectionName) => {
      return `useLiveQuery((q) => q.from({ data: ${collectionName} })).data ?? []`;
    });
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ Query Restored: ${file.replace(srcDir, '')}`);
    fixedCount++;
  }
});

console.log(`\n🎉 Data flow correction complete! Updated ${fixedCount} files.`);
