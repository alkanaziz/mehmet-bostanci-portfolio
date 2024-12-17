import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full">
      <Image className="w-full" src="/banner.png" alt="Bostanci Art" width={1500} height={2024} />
    </div>
  );
}
