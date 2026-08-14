const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-\[#f5f5f7\]/g, to: 'bg-[#1c1c1e]' },
  { from: /bg-white/g, to: 'bg-[#252525]' },
  { from: /bg-\[#ffffff\]/g, to: 'bg-[#252525]' },
  { from: /text-\[#1d1d1f\]/g, to: 'text-white/90' },
  { from: /text-\[#86868b\]/g, to: 'text-white/60' },
  { from: /text-\[#515154\]/g, to: 'text-white/70' },
  { from: /text-gray-400/g, to: 'text-gray-500' },
  { from: /border-black\/\[0.04\]/g, to: 'border-white/5' },
  { from: /border-black\/\[0.03\]/g, to: 'border-white/5' },
  { from: /border-black\/\[0.02\]/g, to: 'border-white/5' },
  { from: /border-gray-200/g, to: 'border-white/10' },
  { from: /border-gray-100/g, to: 'border-white/10' },
  { from: /bg-gray-50/g, to: 'bg-[#1e1e1e]' },
  { from: /bg-gray-100/g, to: 'bg-[#2a2a2a]' },
  { from: /hover:bg-gray-50/g, to: 'hover:bg-[#2a2a2a]' },
  { from: /hover:bg-gray-100/g, to: 'hover:bg-[#333333]' },
  { from: /bg-blue-50/g, to: 'bg-blue-500/10' },
  { from: /text-\[#1a1a1a\]/g, to: 'text-white/90' },
  { from: /shadow-\[0_2px_10px_rgba\(0,0,0,0.04\)\]/g, to: 'shadow-lg' },
  { from: /shadow-\[0_2px_10px_rgba\(0,0,0,0.03\)\]/g, to: 'shadow-md' },
  { from: /shadow-\[0_8px_24px_rgba\(0,0,0,0.08\)\]/g, to: 'shadow-xl' },
  { from: /bg-gradient-to-br from-\[#f5f7fa\] to-\[#e4e9f2\]/g, to: 'bg-gradient-to-br from-[#252525] to-[#1c1c1e]' }
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
