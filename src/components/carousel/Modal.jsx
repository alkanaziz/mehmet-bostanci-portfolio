"use client";

import { Dialog } from "@headlessui/react";
import { useState } from "react";
import useKeypress from "@/lib/useKeypress";
import SharedModal from "./SharedModal";

/**
 * Lightbox for one photo of `images`. Controlled by the gallery: the shown photo
 * comes from the address (each artwork has its own URL), onChange/onClose update it.
 */
export default function Modal({ images, activeId, onChange, onClose }) {
  const [direction, setDirection] = useState(0);
  const currentIndex = images.findIndex((img) => img.id === activeId);

  function changePhotoId(newId) {
    const newIndex = images.findIndex((img) => img.id === newId);
    setDirection(newIndex > currentIndex ? 1 : -1);
    onChange(newId);
  }

  useKeypress("ArrowRight", () => {
    if (currentIndex < images.length - 1) changePhotoId(images[currentIndex + 1].id);
  });

  useKeypress("ArrowLeft", () => {
    if (currentIndex > 0) changePhotoId(images[currentIndex - 1].id);
  });

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0">
        <div className="fixed inset-0 z-30 bg-black/70" />
      </div>

      <div className="relative z-50 w-full max-w-7xl">
        <SharedModal
          index={activeId}
          direction={direction}
          images={images}
          changePhotoId={changePhotoId}
          closeModal={onClose}
          navigation={true}
        />
      </div>
    </Dialog>
  );
}
