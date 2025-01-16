"use client"

import ImgContainer from "./ImgContainer";
import { useEffect, useState } from "react";

async function fetchImages(topic) {
  const response = await fetch(`/api/photos?topic=${topic}`);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
  return await response.json();
}

export default function Gallery({ topic }) {
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchImages(topic);
        setImages(data);
      } catch (err) {
        setError(err);
      }
    };
    
    loadImages();
  }, [topic]);

  if (error) {
    return <h2 className="m-4 text-2xl-font-bold">Kein Bild gefunden!</h2>;
  }

  if (!images) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="my-3 mx-10 flex flex-col gap-3">
      {Object.entries(images).map(([prefix, photos]) => (
        <div key={prefix}>
          <div className="flex flex-wrap justify-center sm:justify-end gap-3">
            {photos.map((photo) => (
              <ImgContainer key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
