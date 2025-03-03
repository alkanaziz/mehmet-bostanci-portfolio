import sizeOf from "image-size";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";
import imageAlts from "../src/data/imageAlts.json" assert { type: "json" };
import addBlurredDataUrl from "../src/lib/getBase64.js";

// Get the correct project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.join(__dirname, "..");

async function generatePublicImageMeta() {
  const publicDir = path.join(projectRoot, "public");
  const imageMeta = {};

  try {
    const files = await fs.readdir(publicDir);
    const imageFiles = files.filter((file) => /\.(png|jpe?g)$/i.test(file));

    let i = 0;
    for (const file of imageFiles) {
      const imagePath = path.join(publicDir, file);
      const stat = await fs.stat(imagePath);

      if (!stat.isFile()) {
        continue; // Skip directories
      }

      const dimensions = sizeOf(imagePath);
      const fileName = file.replace(/\.[^/.]+$/, "");
      const altText = imageAlts[fileName] || fileName;
      const blurredDataUrl = await addBlurredDataUrl(
        { src: `/${file}` },
        publicDir,
      );

      imageMeta[fileName] = {
        id: i,
        public_id: fileName,
        width: dimensions.width,
        height: dimensions.height,
        alt: altText,
        src: `/${file}`,
        blurDataUrl: blurredDataUrl.blurredDataUrl,
        prefix: fileName.substring(0, 4),
        format: file.split(".").pop(),
      };
      i++;
    }

    await fs.writeFile(
      path.join(projectRoot, "src/data/publicImageMeta.json"),
      JSON.stringify(imageMeta, null, 2),
    );
    console.log("publicImageMeta.json has been generated successfully.");
  } catch (error) {
    console.error("Error generating publicImageMeta.json:", error);
  }
}

generatePublicImageMeta();
