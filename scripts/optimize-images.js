#!/usr/bin/env node
/**
 * Image Optimisation Pipeline
 *
 * Converts JPEG/PNG assets to WebP + AVIF (next-gen formats) for maximum
 * compression with no visible quality loss. Originals are kept as fallback.
 *
 * SETUP:
 *   npm install --save-dev sharp glob
 *
 * USAGE:
 *   node scripts/optimize-images.js
 *   (or add "optimize": "node scripts/optimize-images.js" to package.json scripts)
 *
 * OUTPUT:
 *   public/BJ.jpeg        → public/BJ.webp  + public/BJ.avif
 *   public/BJ2.jpeg       → public/BJ2.webp + public/BJ2.avif
 *   public/logo.png       → public/logo.webp
 *   public/Icon.png       → public/Icon.webp
 *
 * In your components use <picture> with AVIF → WebP → JPEG fallback:
 *
 *   <picture>
 *     <source srcSet="/BJ.avif" type="image/avif" />
 *     <source srcSet="/BJ.webp" type="image/webp" />
 *     <img src="/BJ.jpeg" alt="..." loading="lazy" decoding="async" />
 *   </picture>
 */

import sharp from 'sharp';
import { globSync } from 'glob';
import path from 'path';

const PUBLIC_DIR = './public';

// Quality settings (tweak if needed)
const WEBP_QUALITY  = 82;
const AVIF_QUALITY  = 70; // AVIF is more efficient — lower value, better result
const JPEG_QUALITY  = 85;

const images = globSync(`${PUBLIC_DIR}/**/*.{jpg,jpeg,png}`, {
  ignore: ['**/node_modules/**'],
});

if (images.length === 0) {
  console.log('No images found.');
  process.exit(0);
}

console.log(`Found ${images.length} image(s) to optimise...\n`);

let totalSavedBytes = 0;

for (const imgPath of images) {
  const ext = path.extname(imgPath).toLowerCase();
  const base = imgPath.replace(ext, '');
  const filename = path.basename(imgPath);

  try {
    const original = await sharp(imgPath).metadata();
    const originalSize = original.size ?? 0;

    // ── WebP ──────────────────────────────────────────────────────────────────
    const webpPath = `${base}.webp`;
    await sharp(imgPath)
      .webp({ quality: WEBP_QUALITY, effort: 6 })
      .toFile(webpPath);

    const webpStats = await sharp(webpPath).metadata();
    const webpSaving = originalSize - (webpStats.size ?? 0);
    console.log(`✅ ${filename} → WebP  (saved ~${Math.round(webpSaving / 1024)} KB)`);
    totalSavedBytes += webpSaving;

    // ── AVIF (skip PNGs with transparency for now) ────────────────────────────
    if (ext === '.jpg' || ext === '.jpeg') {
      const avifPath = `${base}.avif`;
      await sharp(imgPath)
        .avif({ quality: AVIF_QUALITY, effort: 7 })
        .toFile(avifPath);

      const avifStats = await sharp(avifPath).metadata();
      const avifSaving = originalSize - (avifStats.size ?? 0);
      console.log(`✅ ${filename} → AVIF  (saved ~${Math.round(avifSaving / 1024)} KB)`);
      totalSavedBytes += avifSaving;
    }

  } catch (err) {
    console.error(`❌ Failed to process ${filename}:`, err.message);
  }
}

console.log(`\n📦 Total estimated saving: ~${Math.round(totalSavedBytes / 1024)} KB`);
console.log('\nNext: update <img> tags to use <picture> elements for AVIF/WebP delivery.');
