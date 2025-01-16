import addBlurredDataUrl from "@/lib/getBase64";
import sizeOf from "image-size";
import path from "path";
import fs from "fs/promises";
import imageAlts from "@/data/imageAlts.json";

async function getPhotoData(file, photosDir, topic) {
  const imagePath = path.join(photosDir, file);
  const imageBuffer = await fs.readFile(imagePath);
  const dimensions = sizeOf(imageBuffer);
  const fileName = file.replace(/\.[^/.]+$/, "");
  const altText = imageAlts[fileName] || fileName;
  const prefix = fileName.substring(0, 4);

  return {
    id: fileName,
    src: `/${topic}/${file}`,
    alt: altText,
    width: dimensions.width || 0,
    height: dimensions.height || 0,
    prefix: prefix,
    url: "",
  };
}

function groupPhotosByPrefix(photos) {
  return photos.reduce((acc, photo) => {
    if (!acc[photo.prefix]) {
      acc[photo.prefix] = [];
    }
    acc[photo.prefix].push(photo);
    return acc;
  }, {});
}

async function addBlurredDataToPhotos(groupedPhotos) {
  const groupedPhotosWithBlur = {};
  for (const [prefix, photos] of Object.entries(groupedPhotos)) {
    groupedPhotosWithBlur[prefix] = await Promise.all(
      photos.map((photo) =>
        addBlurredDataUrl(photo, process.cwd() + `/public`),
      ),
    );
  }
  return groupedPhotosWithBlur;
}

async function getPhotos(topic) {
  const photosDir = path.join(process.cwd(), "public", topic);

  try {
    const files = await fs.readdir(photosDir);
    const imageFiles = files.filter((file) => /\.(png|jpe?g)$/i.test(file));

    const photos = await Promise.all(
      imageFiles.map((file) => getPhotoData(file, photosDir, topic)),
    );

    return groupPhotosByPrefix(photos);
  } catch (error) {
    console.error("Error reading photos directory:", error);
    return null;
  }
}

export async function getProcessedPhotos(topic) {
  const groupedPhotos = await getPhotos(topic);
  if (!groupedPhotos) return null;
  return await addBlurredDataToPhotos(groupedPhotos);
}
