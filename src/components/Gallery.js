import ImgContainer from "./ImgContainer";
import addBlurredDataUrl from "@/lib/getBase64";
import sizeOf from "image-size";
import path from "path";
import fs from "fs/promises";

const photos = [
  {
    id: 1,
    src: {
      large: "/bilder-mit-rahmen/01.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 2,
    src: {
      large: "/bilder-mit-rahmen/02.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 3,
    src: {
      large: "/bilder-mit-rahmen/03.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 4,
    src: {
      large: "/bilder-mit-rahmen/04.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 5,
    src: {
      large: "/bilder-mit-rahmen/05.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 6,
    src: {
      large: "/bilder-mit-rahmen/06.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 7,
    src: {
      large: "/bilder-mit-rahmen/07.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 8,
    src: {
      large: "/bilder-mit-rahmen/08.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 9,
    src: {
      large: "/bilder-mit-rahmen/09.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 10,
    src: {
      large: "/bilder-mit-rahmen/10.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 11,
    src: {
      large: "/bilder-mit-rahmen/11.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 12,
    src: {
      large: "/bilder-mit-rahmen/12.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 13,
    src: {
      large: "/bilder-mit-rahmen/13.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 14,
    src: {
      large: "/bilder-mit-rahmen/14.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 15,
    src: {
      large: "/bilder-mit-rahmen/15.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 16,
    src: {
      large: "/bilder-mit-rahmen/16.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 17,
    src: {
      large: "/bilder-mit-rahmen/17.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 18,
    src: {
      large: "/bilder-mit-rahmen/18.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 19,
    src: {
      large: "/bilder-mit-rahmen/19.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 20,
    src: {
      large: "/bilder-mit-rahmen/20.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 21,
    src: {
      large: "/bilder-mit-rahmen/21.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 22,
    src: {
      large: "/bilder-mit-rahmen/22.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 23,
    src: {
      large: "/bilder-mit-rahmen/23.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 24,
    src: {
      large: "/bilder-mit-rahmen/24.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 25,
    src: {
      large: "/bilder-mit-rahmen/25.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 26,
    src: {
      large: "/bilder-mit-rahmen/26.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 27,
    src: {
      large: "/bilder-mit-rahmen/27.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 28,
    src: {
      large: "/bilder-mit-rahmen/28.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 29,
    src: {
      large: "/bilder-mit-rahmen/29.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 30,
    src: {
      large: "/bilder-mit-rahmen/30.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 31,
    src: {
      large: "/bilder-mit-rahmen/31.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 32,
    src: {
      large: "/bilder-mit-rahmen/32.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 33,
    src: {
      large: "/bilder-mit-rahmen/33.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 34,
    src: {
      large: "/bilder-mit-rahmen/34.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 35,
    src: {
      large: "/bilder-mit-rahmen/35.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 36,
    src: {
      large: "/bilder-mit-rahmen/36.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 37,
    src: {
      large: "/bilder-mit-rahmen/37.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 38,
    src: {
      large: "/bilder-mit-rahmen/38.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 39,
    src: {
      large: "/bilder-mit-rahmen/39.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
  {
    id: 40,
    src: {
      large: "/bilder-mit-rahmen/40.png",
    },
    alt: "",
    width: 0,
    height: 0,
    url: "",
  },
];

// Async IIFE für die Bildabmessungen
(async () => {
  for (let image of photos) {
    const imagePath = path.join(process.cwd(), "public", image.src.large);
    try {
      const imageBuffer = await fs.readFile(imagePath);
      const dimensions = sizeOf(imageBuffer);
      image.width = dimensions.width || 0;
      image.height = dimensions.height || 0;
    } catch (error) {
      console.error(
        `Error reading image dimensions for ${image.src.large}:`,
        error
      );
    }
  }
})();

const images = {
  page: 1,
  per_page: 15,
  next_page: "",
  prev_page: "",
  total_results: 40,
  photos: photos,
};

export default async function Gallery({ topic }) {
  if (!images)
    return <h2 className="m-4 text-2xl-font-bold">No images found</h2>;

  const photosWithBlur = await Promise.all(
    images.photos.map(photo =>
      addBlurredDataUrl(photo, process.cwd() + "/public")
    )
  );

  return (
    <section className="my-3 mx-10 grid grid-cols-gallery auto-rows-[10px]">
      {photosWithBlur.map((photo) => (
        <ImgContainer key={photo.id} photo={photo} />
      ))}
    </section>
  );
}
