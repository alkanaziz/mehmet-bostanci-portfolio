"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Modal from "@/components/carousel/Modal";
import ImgContainer from "./ImgContainer";

const GROUPS_PER_PAGE = 6;

// Reads ?photoId= and shows the lightbox. Kept in its own Suspense boundary so the
// grid itself is rendered into the static HTML.
function GalleryModal({ images, onClose }) {
  const photoId = useSearchParams().get("photoId");
  if (!photoId) return null;
  return <Modal images={images} onClose={() => onClose(photoId)} />;
}

/**
 * groups: [{ key, photos: [{ id, src, thumb, width, height, alt, ... }] }] from
 * lib/cms.js, already in display order. Photos of one group share a row.
 */
export default function Gallery({ groups }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [lastViewedPhoto, setLastViewedPhoto] = useState(null);
  const lastViewedPhotoRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(groups.length / GROUPS_PER_PAGE));
  const displayedGroups = groups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE);
  const images = useMemo(() => groups.flatMap((group) => group.photos), [groups]);

  // The static HTML always shows page 1; restore ?page= from the address once.
  useEffect(() => {
    const page = Number(new URLSearchParams(window.location.search).get("page"));
    if (Number.isInteger(page) && page > 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  // After closing the lightbox, scroll to the photo that was viewed last.
  useEffect(() => {
    if (lastViewedPhoto) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [lastViewedPhoto]);

  // Replace (not push) the address, so the back button leaves the gallery.
  const goToPage = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set("page", String(page));
    else params.delete("page");
    const query = params.toString();
    window.history.replaceState(null, "", query ? `${window.location.pathname}?${query}` : window.location.pathname);
  };

  const photoHref = (id) => `?${currentPage > 1 ? `page=${currentPage}&` : ""}photoId=${id}`;

  if (groups.length === 0) {
    return <h2 className="m-4 text-2xl font-bold">Kein Bild gefunden!</h2>;
  }

  return (
    <div className="mx-auto w-full max-w-[1960px] p-4">
      <Suspense fallback={null}>
        <GalleryModal images={images} onClose={(id) => setLastViewedPhoto(id)} />
      </Suspense>

      <div className="mx-10 my-3 flex flex-col gap-3">
        {displayedGroups.map((group) => (
          <div key={group.key} className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            {group.photos.map((photo) => (
              <Link
                key={photo.id}
                href={photoHref(photo.id)}
                scroll={false}
                ref={photo.id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                className="shrink-0"
              >
                <ImgContainer photo={photo} />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => goToPage(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Vorherige Seite"
            className="rounded-sm enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <BiSolidLeftArrow />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                aria-current={currentPage === i + 1 ? "page" : undefined}
                className={`rounded-xs px-2 text-xl font-extrabold text-white ${
                  currentPage === i + 1 ? "bg-gray-900" : "bg-gray-400 hover:scale-90"
                }`}
                onClick={() => goToPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => goToPage(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            aria-label="Nächste Seite"
            className="rounded-sm enabled:hover:scale-110 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <BiSolidRightArrow />
          </button>
        </div>
      )}
    </div>
  );
}
