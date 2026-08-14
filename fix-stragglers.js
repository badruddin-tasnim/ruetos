const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-gray-200/g, to: 'bg-white/10' },
  { from: /hover:bg-gray-200/g, to: 'hover:bg-white/10' },
  { from: /hover:bg-gray-300/g, to: 'hover:bg-white/20' },
  { from: /bg-gray-300/g, to: 'bg-white/20' },
  { from: /bg-\[#f5f5f5\]/g, to: 'bg-[#1c1c1e]' },
  { from: /bg-blue-500\/100/g, to: 'bg-blue-500' },
  { from: /border-gray-300/g, to: 'border-white/20' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      for (const { from, to } of replacements) {
        if (from.test(content)) {
          content = content.replace(from, to);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src', 'components', 'apps'));
processDirectory(path.join(__dirname, 'src', 'components', 'os'));
console.log('Done.');
