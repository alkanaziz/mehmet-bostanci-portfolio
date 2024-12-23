import fs from "node:fs/promises";
import { getPlaiceholder } from "plaiceholder";
import path from "path";

async function getBase64(imagePath) {
  try {
    const file = await fs.readFile(imagePath);
    const { base64 } = await getPlaiceholder(file);
    return base64;
  } catch (error) {
    if (error instanceof Error) console.error(error.stack);
    return null;
  }
}

export default async function addBlurredDataUrl(photo, baseImagePath) {
  if (!photo.src?.large) {
    console.error("Geçersiz resim yolu:", photo);
    return photo;
  }

  const base64 = await getBase64(path.join(baseImagePath, photo.src.large));

  if (base64) {
    photo.blurredDataUrl = base64;
  }

  return photo;
}
