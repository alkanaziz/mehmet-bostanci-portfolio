// One-time: convert the original site images into web versions for the WordPress import.
// Originals are never modified.
//
//   node scripts/cms-import/convert-images.mjs <originals-dir> <output-dir>
//
// Artworks and photos -> JPEG (sRGB, long edge max 3000 px, quality 85, 4:4:4 chroma,
// transparency flattened onto white like the site shows it). Logos stay PNG (flat
// colours and sharp edges look bad as JPEG).

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error("Usage: node convert-images.mjs <originals-dir> <output-dir>");
  process.exit(1);
}

const MAX_SIDE = 3000;
const TOPICS = ["aquarell", "digitale-werke", "gemaelde", "logo", "workshop"];
const SITE_IMAGES = ["hero_img.png", "home_img.png", "ueber-mich.jpg"];

async function convert(inFile, outDir, keepPng) {
  const base = path.basename(inFile).replace(/\.[^.]+$/, "");
  const pipeline = sharp(inFile)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true });

  let outFile;
  if (keepPng) {
    outFile = path.join(outDir, `${base}.png`);
    await pipeline.png({ compressionLevel: 9 }).withIccProfile("srgb").toFile(outFile);
  } else {
    outFile = path.join(outDir, `${base}.jpg`);
    await pipeline
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 85, chromaSubsampling: "4:4:4", progressive: true, mozjpeg: true })
      .withIccProfile("srgb")
      .toFile(outFile);
  }
  const [before, after] = await Promise.all([fs.stat(inFile), fs.stat(outFile)]);
  const meta = await sharp(outFile).metadata();
  return { file: path.relative(out, outFile), width: meta.width, height: meta.height, before: before.size, after: after.size };
}

const results = [];
for (const topic of TOPICS) {
  const dir = path.join(src, topic);
  const outDir = path.join(out, topic);
  await fs.mkdir(outDir, { recursive: true });
  const files = (await fs.readdir(dir)).filter((f) => /\.(png|jpe?g)$/i.test(f)).sort();
  for (const f of files) results.push(await convert(path.join(dir, f), outDir, topic === "logo"));
}
const siteDir = path.join(out, "site");
await fs.mkdir(siteDir, { recursive: true });
for (const f of SITE_IMAGES) results.push(await convert(path.join(src, f), siteDir, false));

const mb = (n) => (n / 1048576).toFixed(1);
const total = results.reduce((a, r) => ({ before: a.before + r.before, after: a.after + r.after }), { before: 0, after: 0 });
const largest = [...results].sort((a, b) => b.after - a.after)[0];
console.log(`${results.length} images: ${mb(total.before)} MB -> ${mb(total.after)} MB`);
console.log(`largest output: ${largest.file} ${largest.width}x${largest.height} ${mb(largest.after)} MB`);
