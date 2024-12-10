import Image from "next/image";

export default function Home() {
  return (
    <div className="z-10">
      <Image className="w-full" src="/home_img.png" alt="Bostanci Art" width={1200} height={1500} />
    </div>
  );
}
