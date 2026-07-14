#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'skills');
const targetDir = path.join(process.cwd(), '.agents', 'skills');

console.log('🚀 Installing tejaspr-ux-skills into .agents/skills...');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function copyDirectorySync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectorySync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  copyDirectorySync(sourceDir, targetDir);
  console.log('✅ Skills successfully installed! Your AI agents can now use them.');
} catch (error) {
  console.error('❌ Failed to install skills:', error);
  process.exit(1);
}
