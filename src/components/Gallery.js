"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import Modal from "@/components/carousel/Modal";
import ImgContainer from "./ImgContainer";

const GROUPS_PER_PAGE = 6;

const withSlash = (path) => (path.endsWith("/") ? path : `${path}/`);
const withoutSlash = (path) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

/**
 * groups: [{ key, photos: [{ id, slug, path, src, thumb, alt, ... }] }] from
 * lib/cms.js, already in display order. Photos of one group share a row.
 * basePath: path of this gallery, e.g. "/werke/aquarelle".
 *
 * Every artwork has its own URL (basePath/slug/, prerendered with its own title
 * and preview). The lightbox follows the address: clicking a thumbnail pushes
 * the artwork URL (Back closes the lightbox again), the arrows replace it, and
 * opening an artwork URL directly shows the gallery with that artwork open.
 */
export default function Gallery({ groups, basePath, galleryTitle }) {
  const pathname = withoutSlash(usePathname());
  const images = useMemo(() => groups.flatMap((group) => group.photos), [groups]);
  const pageOfPhoto = useMemo(() => {
    const pages = new Map();
    groups.forEach((group, i) => group.photos.forEach((p) => pages.set(p.id, Math.floor(i / GROUPS_PER_PAGE) + 1)));
    return pages;
  }, [groups]);
  const active = images.find((photo) => photo.path === pathname) ?? null;

  const [currentPage, setCurrentPage] = useState(() => (active ? pageOfPhoto.get(active.id) : 1));
  const [lastViewedPhoto, setLastViewedPhoto] = useState(null);
  const lastViewedPhotoRef = useRef(null);
  const openedHere = useRef(false); // lightbox opened by a click on this page (Back can close it)

  const totalPages = Math.max(1, Math.ceil(groups.length / GROUPS_PER_PAGE));
  const displayedGroups = groups.slice((currentPage - 1) * GROUPS_PER_PAGE, currentPage * GROUPS_PER_PAGE);

  // Once on load: restore ?page= on the gallery, and forward old ?photoId= links.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const legacy = images.find((photo) => String(photo.id) === params.get("photoId"));
    if (legacy) {
      // Next tick: the Next.js router hooks into the history API in its own effect,
      // which runs after this one; only then does the address change reach usePathname.
      setTimeout(() => window.history.replaceState(null, "", withSlash(legacy.path)), 0);
      return;
    }
    const page = Number(params.get("page"));
    if (!active && Number.isInteger(page) && page > 1 && page <= totalPages) setCurrentPage(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on the first render
  }, []);

  // Browser Back/Forward between gallery and artwork URLs.
  useEffect(() => {
    if (!active) openedHere.current = false;
    else setCurrentPage(pageOfPhoto.get(active.id));
  }, [active, pageOfPhoto]);

  // Browser tab title follows the open artwork (each artwork page has its own title).
  useEffect(() => {
    const title = active ? active.pageTitle : galleryTitle;
    if (title) document.title = title;
  }, [active, galleryTitle]);

  // After closing the lightbox, scroll to the photo that was viewed last.
  useEffect(() => {
    if (lastViewedPhoto && !active) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [lastViewedPhoto, active]);

  function openPhoto(event, photo) {
    // New tab, middle click etc. keep the normal link behaviour.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openedHere.current = true;
    window.history.pushState(null, "", withSlash(photo.path));
  }

  function changePhoto(id) {
    const photo = images.find((p) => p.id === id);
    if (photo) window.history.replaceState(null, "", withSlash(photo.path));
  }

  function closePhoto() {
    setLastViewedPhoto(active?.id ?? null);
    if (openedHere.current) {
      window.history.back();
    } else {
      const query = currentPage > 1 ? `?page=${currentPage}` : "";
      window.history.replaceState(null, "", `${withSlash(basePath)}${query}`);
    }
  }

  // Replace (not push) the address, so the back button leaves the gallery.
  function goToPage(page) {
    setCurrentPage(page);
    const query = page > 1 ? `?page=${page}` : "";
    window.history.replaceState(null, "", `${withSlash(basePath)}${query}`);
  }

  if (groups.length === 0) {
    return <h2 className="m-4 text-2xl font-bold">Kein Bild gefunden!</h2>;
  }

  return (
    <div className="mx-auto w-full max-w-[1960px] p-4">
      {active && <Modal images={images} activeId={active.id} onChange={changePhoto} onClose={closePhoto} />}

      <div className="mx-10 my-3 flex flex-col gap-3">
        {displayedGroups.map((group) => (
          <div key={group.key} className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            {group.photos.map((photo) => (
              <a
                key={photo.id}
                href={withSlash(photo.path)}
                onClick={(event) => openPhoto(event, photo)}
                ref={photo.id === lastViewedPhoto ? lastViewedPhotoRef : null}
                className="shrink-0"
              >
                <ImgContainer photo={photo} />
              </a>
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
