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
    let i = 0;
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
        const fileName = file.replace(/\.[^/.]+$/, "");

        try {
          const dimensions = sizeOf(imagePath);

          // Eğer dimensions geçerli değilse atla
          if (!dimensions || !dimensions.width || !dimensions.height) {
            console.warn(`Skipping ${file}: Invalid dimensions`);
            continue;
          }

          const altText = imageAlts[fileName] || fileName;
          const blurredDataUrl = await addBlurredDataUrl(
            { src: `/${topic}/${file}` },
            photosDir,
          );

          imageMeta[fileName] = {
            id: i,
            public_id: fileName,
            width: dimensions.width,
            height: dimensions.height,
            alt: altText,
            src: `/${topic}/${file}`,
            blurDataUrl: blurredDataUrl.blurredDataUrl,
            topic,
            prefix: fileName.substring(0, 4),
            format: file.split(".").pop(),
          };
          i++;
        } catch (error) {
          console.warn(`Skipping ${file}: ${error.message}`);
          continue;
        }
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
