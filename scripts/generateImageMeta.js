import sizeOf from "image-size";
import path from "path";
import fs from "fs/promises";
import imageAlts from "../src/data/imageAlts.json" assert { type: "json" };
import addBlurredDataUrl from "../src/lib/getBase64.js";

async function generateImageMeta() {
  const photosDir = path.join(process.cwd(), "public");
  const imageMeta = {};

  try {
    const topics = await fs.readdir(photosDir);
    for (const topic of topics) {
      const topicDir = path.join(photosDir, topic);
      const stat = await fs.stat(topicDir);

      if (!stat.isDirectory()) {
        continue; // Skip non-directory files
      }

      const files = await fs.readdir(topicDir);
      const imageFiles = files.filter((file) => /\.(png|jpe?g)$/i.test(file));

      for (const file of imageFiles) {
        const imagePath = path.join(topicDir, file);
        const dimensions = sizeOf(imagePath);
        const fileName = file.replace(/\.[^/.]+$/, "");
        const altText = imageAlts[fileName] || fileName;
        const blurredDataUrl = await addBlurredDataUrl(
          { src: `/${topic}/${file}` },
          photosDir,
        );
        imageMeta[fileName] = {
          id: fileName,
          src: `/${topic}/${file}`,
          alt: altText,
          width: dimensions.width,
          height: dimensions.height,
          prefix: fileName.substring(0, 4),
          blurredDataUrl: blurredDataUrl.blurredDataUrl,
          topic,
        };
      }
    }

    await fs.writeFile(
      path.join(process.cwd(), "src/data/imageMeta.json"),
      JSON.stringify(imageMeta, null, 2),
    );
    console.log("imageMeta.json has been generated successfully.");
  } catch (error) {
    console.error("Error generating imageMeta.json:", error);
  }
}

generateImageMeta();
