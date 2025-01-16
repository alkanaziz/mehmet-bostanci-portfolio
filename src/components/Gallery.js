"use client";

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
    window.scrollTo(0, 0);
  }, [topic]);

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
    return <h2 className="text-2xl-font-bold m-4">Kein Bild gefunden!</h2>;
  }

  if (!images) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mx-10 my-3 flex flex-col gap-3">
      {Object.entries(images).map(([prefix, photos]) => (
        <div key={prefix}>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            {photos.map((photo) => (
              <ImgContainer key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
