import imageMeta from "@/data/imageMeta.json";

function groupPhotosByPrefix(photos) {
  return photos.reduce((acc, photo) => {
    if (!acc[photo.prefix]) {
      acc[photo.prefix] = [];
    }
    acc[photo.prefix].push(photo);
    return acc;
  }, {});
}

export async function getProcessedPhotos(topic) {
  const photos = Object.keys(imageMeta)
    .filter((fileName) => imageMeta[fileName].topic === topic)
    .map((fileName) => imageMeta[fileName]);
  return groupPhotosByPrefix(photos);
}
