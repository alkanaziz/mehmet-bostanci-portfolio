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
  const [controlsVisible, setControlsVisible] = useState(true);

  // Hide controls after 1 second on initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setControlsVisible(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hide controls when photo changes
  // useEffect(() => {
  //   setControlsVisible(false);
  // }, [index]);

  // Toggle controls visibility on click
  const handleContainerClick = (e) => {
    e.stopPropagation();
    setControlsVisible(!controlsVisible);
  };

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
      setControlsVisible(true);
    },
    onSwipedRight: () => {
      const currentIndex = images.findIndex((img) => img.id === index);
      if (currentIndex > 0) {
        changePhotoId(images[currentIndex - 1].id);
      }
      setControlsVisible(true);
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
        className="relative z-50 flex w-full max-w-7xl items-center"
        {...handlers}
        onClick={handleContainerClick}
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
                  <div className={`relative flex h-auto max-h-[90%] max-w-full flex-col items-center justify-center bg-white ${isLoading ? "opacity-0" : "opacity-100"}`}>
                    <div className="absolute -right-5 sm:-right-12 -top-12 flex flex-row items-center gap-3 p-3 text-white">
                      <button
                        onClick={() => closeModal()}
                        className="z-50 rounded-full p-2 font-extrabold text-white/75 transition hover:text-white"
                      >
                        {navigation ? (
                          <XMarkIcon className="h-7 w-7 stroke-[4]" />
                        ) : (
                          <ArrowUturnLeftIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <div
                      className={`absolute -left-5 -top-12 flex flex-row items-center gap-3 p-3 text-white ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
                    >
                      <a
                        href={currentImage.src}
                        className="z-50 rounded-full p-2 font-extrabold text-white/75 transition hover:text-white"
                        target="_blank"
                        title="Open fullsize version"
                        rel="noreferrer"
                      >
                        <ArrowTopRightOnSquareIcon className="h-6 w-6 stroke-[2]" />
                      </a>
                    </div>
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
                      className={`m-4 h-auto max-h-[90%] w-auto max-w-[90%] border border-gray-300 ${
                        isLoading ? "opacity-0" : "opacity-100"
                      }`}
                      style={{
                        objectFit: "contain",
                        transition: "opacity 0.3s ease-in-out",
                      }}
                    />
                    {!isLoading && (
                      <div className="relative flex w-full items-center justify-center gap-5">
                        <p className="mb-3 flex w-full items-center justify-center gap-5 text-wrap break-words bg-white text-center text-xs md:text-sm lg:text-base">
                          {currentImage.alt}{" "}
                        </p>
                      </div>
                    )}
                  </div>
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
              <div
                className={`transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
              >
                {navigation && (
                  <>
                    {arrayIndex > 0 && (
                      <button
                        className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          changePhotoId(images[arrayIndex - 1].id);
                        }}
                      >
                        <ChevronLeftIcon className="h-6 w-6" />
                      </button>
                    )}
                    {arrayIndex + 1 < images.length && (
                      <button
                        className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                        style={{ transform: "translate3d(0, 0, 0)" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          changePhotoId(images[arrayIndex + 1].id);
                        }}
                      >
                        <ChevronRightIcon className="h-6 w-6" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* Bottom Nav bar */}
          {navigation && (
            <div
              className={`fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
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
