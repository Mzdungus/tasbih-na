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

// 1. Copier dans assets/ (pour référence web via android_asset)
const assetsDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'data', 'azaan');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 2. Copier dans res/raw/ (requis par LocalNotifications pour le son des notifications)
const rawDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'raw');
if (!fs.existsSync(rawDir)) {
  fs.mkdirSync(rawDir, { recursive: true });
}

// Copier 1.mp3 → assets/data/azaan/1.mp3 ET res/raw/azaan1.mp3
const assetFiles = ['1.mp3', '2.mp3'];
assetFiles.forEach(file => {
  const src = path.join(srcDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(assetsDir, file));
    console.log(`✓ Copied ${file} to Android assets`);
  } else {
    console.warn(`⚠ Warning: ${file} not found at ${src}`);
  }
});

// Copier avec le nom attendu par LocalNotifications (azaan1.mp3, azaan2.mp3)
const rawMap = [
  { src: '1.mp3', dest: 'azaan1.mp3' },
  { src: '2.mp3', dest: 'azaan2.mp3' },
];
rawMap.forEach(({ src, dest }) => {
  const srcPath = path.join(srcDir, src);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(rawDir, dest));
    console.log(`✓ Copied ${src} → res/raw/${dest}`);
  } else {
    console.warn(`⚠ Warning: ${src} not found`);
  }
});

console.log('✓ Azaan assets copied successfully');
