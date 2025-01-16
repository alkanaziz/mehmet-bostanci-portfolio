"use client";

import ImgContainer from "./ImgContainer";
import { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";

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
  const [currentPage, setCurrentPage] = useState(1);
  const prefixesPerPage = 6;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [topic, currentPage]);

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

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

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

  const prefixes = Object.keys(images);
  const totalPages = Math.ceil(prefixes.length / prefixesPerPage);
  const displayedPrefixes = prefixes.slice(
    (currentPage - 1) * prefixesPerPage,
    currentPage * prefixesPerPage,
  );

  return (
    <div className="mx-10 my-3 flex flex-col gap-3">
      {displayedPrefixes.map((prefix) => (
        <div key={prefix}>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            {images[prefix].map((photo) => (
              <ImgContainer key={photo.id} photo={photo} />
            ))}
          </div>
        </div>
      ))}
      <div className="mt-4 flex justify-center gap-3 sm:justify-end">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <BiSolidLeftArrow />
        </button>
        <div className="flex items-center justify-center gap-2 text-sm">
          {Array.from({ length: totalPages }).map((_, i) => {
            const pageIndex = i + 1;
            return (
              <button
                key={i + 1}
                className={`rounded-sm px-2 text-xl font-extrabold text-white ${currentPage === i + 1 ? "bg-gray-900" : "bg-gray-400 hover:scale-90"}`}
                onClick={() => setCurrentPage(pageIndex)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <BiSolidRightArrow />
        </button>
      </div>
    </div>
  );
}
