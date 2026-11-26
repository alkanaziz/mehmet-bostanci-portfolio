"use client";

import { useState } from "react";
import ResponsiveImage from "@/components/ResponsiveImage";

/** page: { title, excerpt, html, image } of the CMS page "ueber-mich". */
export default function UeberMich({ page }) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const { image } = page;

  return (
    <div className="mx-auto mt-4 min-h-screen max-w-3xl bg-white p-4">
      {/* Modal for enlarged image */}
      {isImageModalOpen && image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-6xl">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              Schließen ✕
            </button>
            <ResponsiveImage
              image={image}
              sizes="(min-width: 1152px) 1152px, 90vw"
              priority
              className="h-auto max-h-[85vh] w-auto rounded-lg object-contain"
            />
          </div>
        </div>
      )}

      <div>
        {image && (
          <div className="group relative float-left mr-8 mb-6 flex w-full items-center justify-center md:w-100">
            <button
              type="button"
              aria-label="Bild vergrößern"
              className="relative transform cursor-pointer overflow-hidden rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-2xl md:rounded-none md:rounded-tl-lg"
              onClick={() => setIsImageModalOpen(true)}
            >
              <ResponsiveImage
                image={image}
                sizes="(min-width: 768px) 400px, 100vw"
                priority
                className="h-auto w-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 hover:opacity-100">
                <span className="rounded-full bg-black/50 px-4 py-2 text-sm font-medium text-white backdrop-blur-xs">
                  Vergrößern
                </span>
              </div>
            </button>
            {/* Artist Name Overlay */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 via-black/50 to-transparent p-3 text-white">
              <h1 className="mb-1 font-serif text-3xl font-bold tracking-wide">Mehmet Bostanci</h1>
              {page.excerpt && (
                <p className="text-sm font-medium tracking-wider uppercase opacity-90">{page.excerpt}</p>
              )}
            </div>
          </div>
        )}

        {/* Text from the CMS */}
        <div
          className="cms-content dropcap text-justify leading-relaxed text-gray-800"
          dangerouslySetInnerHTML={{ __html: page.html }}
        />
      </div>
    </div>
  );
}
