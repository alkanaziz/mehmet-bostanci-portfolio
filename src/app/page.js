import Image from "next/image";
import addBlurredDataUrl from "@/lib/getBase64";

export default async function Home() {
  const photo = {
    src: "/banner.png"
  };

  const photoWithBlur = await addBlurredDataUrl(photo, process.cwd() + "/public");

  return (
    <div className="w-full">
      <Image
        className="w-full"
        src="/banner.png"
        alt="Bostanci Art"
        width={1500}
        height={2024}
        placeholder="blur"
        blurDataURL={photoWithBlur.blurredDataUrl}
      />
    </div>
  );
}
