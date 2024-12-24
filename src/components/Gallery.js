import ImgContainer from "./ImgContainer";
import addBlurredDataUrl from "@/lib/getBase64";
import sizeOf from "image-size";
import path from "path";
import fs from "fs/promises";
import imageAlts from "@/data/imageAlts.json";

async function getPhotos(topic) {
  const photosDir = path.join(process.cwd(), "public", topic);

  try {
    const files = await fs.readdir(photosDir);
    const imageFiles = files.filter(file =>
      /\.(png|jpe?g)$/i.test(file)
    );

    const photos = await Promise.all(
      imageFiles.map(async (file) => {
        const imagePath = path.join(photosDir, file);
        const imageBuffer = await fs.readFile(imagePath);
        const dimensions = sizeOf(imageBuffer);
        const fileName = file.replace(/\.[^/.]+$/, "");
        const altText = imageAlts[fileName] || fileName;
        const prefix = fileName.substring(0, 4); // A001, A002 gibi prefix'leri al

        return {
          id: fileName,
          src: `/${topic}/${file}`,
          alt: altText,
          width: dimensions.width || 0,
          height: dimensions.height || 0,
          prefix: prefix,
          url: ""
        };
      })
    );

    // Resimleri prefix'lerine göre grupla
    const groupedPhotos = photos.reduce((acc, photo) => {
      if (!acc[photo.prefix]) {
        acc[photo.prefix] = [];
      }
      acc[photo.prefix].push(photo);
      return acc;
    }, {});

    return {
      page: 1,
      per_page: 15,
      total_results: photos.length,
      photos: groupedPhotos
    };

  } catch (error) {
    console.error("Error reading photos directory:", error);
    return null;
  }
}

export default async function Gallery({ topic }) {
  const images = await getPhotos(topic);

  if (!images)
    return <h2 className="m-4 text-2xl-font-bold">Resim bulunamadı</h2>;

  const groupedPhotosWithBlur = {};
  for (const [prefix, photos] of Object.entries(images.photos)) {
    groupedPhotosWithBlur[prefix] = await Promise.all(
      photos.map(photo => addBlurredDataUrl(photo, process.cwd() + `/public`))
    );
  }

  return (
    <div className="my-3 mx-10">
      {Object.entries(groupedPhotosWithBlur).map(([prefix, photos]) => (
        <div key={prefix} className="">
          <div className="grid grid-cols-gallery auto-rows-[10px]">
            {photos.map((photo) => (
              <ImgContainer key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
