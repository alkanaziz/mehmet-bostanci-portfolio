import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Image className="w-full" src="/home_img.png" alt="Bostanci Art" width={1200} height={1500} />
    </div>
  );
}
