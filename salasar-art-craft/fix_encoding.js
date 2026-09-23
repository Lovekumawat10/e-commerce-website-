const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the corrupted characters
  let changed = false;
  
  if (content.includes('â‚¹')) {
    content = content.replace(/â‚¹/g, '₹');
    changed = true;
  }
  
  if (content.match(/[^\x00-\x7F]*\{.*toLocaleString\('en-IN'\)\}/)) {
    // Specifically target the exact symbol right before {something.toLocaleString('en-IN')}
    content = content.replace(/([^\x00-\x7F]+|,1|\?|\,1)\{([A-Za-z0-9_\.]+\.toLocaleString\('en-IN'\))\}/g, '₹{}');
    changed = true;
  }

  // specifically catch ,1 as it was printed in powershell, might just be â‚¹ in UTF-8 buffer but we can just use the regex
  content = content.replace(/,1/g, '₹');

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Fixed encoding issues in all TSX files.');
