"use client";

import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { variants } from "@/lib/animationVariants";
import downloadPhoto from "@/lib/downloadPhoto";
import { range } from "@/lib/range";

export default function SharedModal({
  index, // This is now the actual image ID, not array index
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // if index is changed, set loaded to false
  useEffect(() => {
    setIsLoading(true);
  }, [index]);

  // Find the current image's index in the array
  const arrayIndex = images.findIndex((img) => img.id === index);

  let filteredImages = images?.filter((img) =>
    range(arrayIndex - 15, arrayIndex + 15).includes(images.indexOf(img)),
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      const currentIndex = images.findIndex((img) => img.id === index);
      if (currentIndex < images.length - 1) {
        changePhotoId(images[currentIndex + 1].id);
      }
    },
    onSwipedRight: () => {
      const currentIndex = images.findIndex((img) => img.id === index);
      if (currentIndex > 0) {
        changePhotoId(images[currentIndex - 1].id);
      }
    },
    trackMouse: true,
  });

  let currentImage = images
    ? images.find((img) => img.id === index)
    : currentPhoto;

  if (!currentImage) {
    return null;
  }

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="wide:h-full xl:taller-than-854:h-auto relative z-50 flex w-full max-w-7xl items-center"
        {...handlers}
      >
        {/* Main image */}
        <div className="imageContainer h-[90vh] w-full overflow-hidden md:h-[80vh] lg:h-[70vh] xl:h-[80vh]">
          <div className="relative flex h-full items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute flex h-full w-full flex-col items-center justify-center"
              >
                <div className="relative flex h-full flex-col items-center justify-center">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                    </div>
                  )}
                  <Image
                    src={currentImage.src}
                    priority
                    alt={currentImage.alt}
                    onLoad={() => {
                      setLoaded(true);
                      setIsLoading(false);
                    }}
                    width={currentImage.width}
                    height={currentImage.height}
                    className={`h-auto max-h-[90%] w-auto max-w-full border-[1em] border-white ${
                      isLoading ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      objectFit: "contain",
                      transition: "opacity 0.3s ease-in-out",
                    }}
                  />

                  {!isLoading && (
                    <p className="w-full text-wrap break-words bg-white pb-3 text-center text-xs md:text-sm lg:text-[1rem]">
                      {currentImage.alt}
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {/* Buttons */}
          {loaded && (
            <div className="relative h-screen max-h-[90vh] w-full">
              {navigation && (
                <>
                  {arrayIndex > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(images[arrayIndex - 1].id)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {arrayIndex + 1 < images.length && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(images[arrayIndex + 1].id)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute right-0 top-0 flex items-center gap-2 p-3 text-white">
                <a
                  href={currentImage.src}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  target="_blank"
                  title="Open fullsize version"
                  rel="noreferrer"
                >
                  <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                </a>
                <button
                  onClick={() =>
                    downloadPhoto(
                      currentImage.src,
                      `${index}.${currentImage.format}`,
                    )
                  }
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute left-0 top-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  {navigation ? (
                    <XMarkIcon className="h-5 w-5" />
                  ) : (
                    <ArrowUturnLeftIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Bottom Nav bar */}
          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                initial={false}
                className="mx-auto mb-6 mt-6 flex aspect-[3/2] h-14"
              >
                <AnimatePresence initial={false}>
                  {filteredImages.map(({ id, src }) => (
                    <motion.button
                      initial={{
                        width: "0%",
                        x: `${Math.max((arrayIndex - 1) * -100, 15 * -100)}%`,
                      }}
                      animate={{
                        scale: id === index ? 1.25 : 1,
                        width: "100%",
                        x: `${Math.max(arrayIndex * -100, 15 * -100)}%`,
                      }}
                      exit={{ width: "0%" }}
                      onClick={() => changePhotoId(id)}
                      key={id}
                      className={`${
                        id === index
                          ? "z-20 rounded-md shadow shadow-black/50"
                          : "z-10"
                      } ${id === 0 ? "rounded-l-md" : ""} ${
                        id === images.length - 1 ? "rounded-r-md" : ""
                      } relative inline-block w-full shrink-0 transform-gpu overflow-hidden focus:outline-none`}
                    >
                      <Image
                        alt="small photos on the bottom"
                        width={180}
                        height={120}
                        className={`${
                          id === index
                            ? "brightness-110 hover:brightness-110"
                            : "brightness-50 contrast-125 hover:brightness-75"
                        } h-full transform object-cover transition`}
                        src={src}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
