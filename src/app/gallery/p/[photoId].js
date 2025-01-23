"use client"

import Head from "next/head";
import { useRouter, useSearchParams } from "next/navigation";
import Carousel from "@/components/carousel/Carousel";
import imageMeta from "../../../data/imageMeta.json";
import { useEffect, useState } from "react";

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const photoId = searchParams.get("photoId");
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    if (photoId) {
      const photo = Object.values(imageMeta).find(
        (img) => img.id === Number(photoId)
      );
      setCurrentPhoto(photo);
    }
  }, [photoId]);

  if (!currentPhoto) {
    return <div>Loading...</div>;
  }

  const currentPhotoUrl = currentPhoto.src;

  return (
    <>
      <Head>
        <title>Next.js Conf 2022 Photos</title>
        <meta property="og:image" content={currentPhotoUrl} />
        <meta name="twitter:image" content={currentPhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        <Carousel currentPhoto={currentPhoto} index={Number(photoId)} />
      </main>
    </>
  );
};

export default Home;
