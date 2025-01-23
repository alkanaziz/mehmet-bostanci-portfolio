import { Dialog } from "@headlessui/react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import useKeypress from "react-use-keypress";
import SharedModal from "./SharedModal";

export default function Modal({ images, onClose, topic }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const photoId = Number(searchParams.get("photoId"));

  // Ensure images is an array and add null check
  const imageArray = Array.isArray(images) ? images : [];

  // Find the index of current image based on its ID
  const currentImageIndex = imageArray.findIndex((img) => img.id === photoId);

  const [direction, setDirection] = useState(0);
  const [curIndex, setCurIndex] = useState(photoId);

  function handleClose() {
    router.replace(pathname);
    onClose();
  }

  function changePhotoId(newId) {
    const newIndex = imageArray.findIndex((img) => img.id === newId);
    if (newIndex > currentImageIndex) {
      setDirection(1);
    } else {
      setDirection(-1);
    }
    setCurIndex(newId);

    const params = new URLSearchParams(searchParams);
    params.set("photoId", newId.toString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  useKeypress("ArrowRight", () => {
    const currentIndex = imageArray.findIndex((img) => img.id === curIndex);
    if (currentIndex < imageArray.length - 1) {
      changePhotoId(imageArray[currentIndex + 1].id);
    }
  });

  useKeypress("ArrowLeft", () => {
    const currentIndex = imageArray.findIndex((img) => img.id === curIndex);
    if (currentIndex > 0) {
      changePhotoId(imageArray[currentIndex - 1].id);
    }
  });

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      className="fixed inset-0 z-40 flex items-center justify-center"
    >
      <div className="fixed inset-0">
        <div className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl" />
      </div>

      <div className="relative z-50 w-full max-w-7xl">
        <SharedModal
          index={curIndex}
          direction={direction}
          images={imageArray}
          changePhotoId={changePhotoId}
          closeModal={handleClose}
          navigation={true}
        />
      </div>
    </Dialog>
  );
}
