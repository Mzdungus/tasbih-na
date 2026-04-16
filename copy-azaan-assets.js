#!/usr/bin/env node

/**
 * Script to copy azaan audio files to Android assets
 * Run before building for Android
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src', 'data', 'azaan');
const destDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'data', 'azaan');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy MP3 files
const files = ['1.mp3', '2.mp3'];
files.forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${file} to Android assets`);
  } else {
    console.warn(`⚠ Warning: ${file} not found at ${src}`);
  }
});

console.log('✓ Azaan assets copied successfully');
