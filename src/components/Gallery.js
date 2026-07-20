"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Modal from "@/components/carousel/Modal";
import imageMeta from "@/data/imageMeta";
import ImgContainer from "./ImgContainer";

function getProcessedPhotos(topic) {
  const photos = Object.keys(imageMeta)
    .filter((fileName) => imageMeta[fileName].topic === topic)
    .map((fileName) => imageMeta[fileName]);

  if (topic === "aquarell") {
    photos.sort((a, b) => b.id - a.id);
  }

  return photos.reduce((acc, photo) => {
    if (!acc[photo.prefix]) {
      acc[photo.prefix] = [];
    }
    acc[photo.prefix].push(photo);
    return acc;
  }, {});
}

const LoadingState = () => (
  <div className="flex h-96 items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
  </div>
);

const GalleryContent = ({ topic }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const photoId = searchParams.get("photoId");
  const [lastViewedPhoto, setLastViewedPhoto] = useState(null);
  const lastViewedPhotoRef = useRef(null);
  const [images, setImages] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = getProcessedPhotos(topic);
      setImages(data);
    } catch (err) {
      setError(err);
    }
  }, [topic]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const prefixesPerPage = 6;

  // Calculate pagination for prefixes
  const prefixes = Object.keys(images || {});
  const totalPages = Math.ceil(prefixes.length / prefixesPerPage);
  const displayedPrefixes = prefixes.slice(
    (currentPage - 1) * prefixesPerPage,
    currentPage * prefixesPerPage,
  );

  // Navigation handlers
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  // Sync last viewed photo
  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", currentPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  }, [currentPage, router]);

  // Flatten images for modal
  const flattenedImages = images ? Object.values(images).flat() : [];

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
    <div className="mx-auto w-full max-w-[1960px] p-4">
      {photoId && (
        <Modal
          images={flattenedImages}
          onClose={() => {
            setLastViewedPhoto(photoId);
          }}
          topic={topic}
        />
      )}

      <div className="mx-10 my-3 flex flex-col gap-3">
        {displayedPrefixes.map((prefix) => (
          <div
            key={prefix}
            className="flex flex-wrap items-center justify-center gap-3 sm:justify-end"
          >
            {images[prefix].map((img) => (
              <Link
                key={img.id}
                href={`${pathname}?photoId=${img.id}`}
                ref={
                  img.id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null
                }
                shallow
                className="shrink-0"
              >
                <ImgContainer key={img.id} photo={img} />
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="rounded-sm enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <BiSolidLeftArrow />
        </button>
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              className={`rounded-xs px-2 text-xl font-extrabold text-white ${
                currentPage === i + 1
                  ? "bg-gray-900"
                  : "bg-gray-400 hover:scale-90"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="rounded-sm enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <BiSolidRightArrow />
        </button>
      </div>
    </div>
  );
};

const Gallery = ({ topic }) => {
  return (
    <Suspense fallback={<LoadingState />}>
      <GalleryContent topic={topic} />
    </Suspense>
  );
};

export default Gallery;
