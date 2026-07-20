import Image from "next/image";
import Link from "next/link";
import publicImageMeta from "@/data/publicImageMeta";

const Header = () => {
  const { logo_header, banner } = publicImageMeta;

  return (
    <header
      className="relative w-full overflow-hidden"
      role="banner"
      aria-label="Site header"
    >
      {/* Background Banner */}
      <div className="relative h-16 sm:h-20 md:h-32 lg:h-40 xl:h-48 2xl:h-52">
        <Image
          src={banner.src}
          alt={banner.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
          placeholder="blur"
          blurDataURL={banner.blurDataUrl}
        />

        {/* Logo Overlay */}
        <div className="absolute inset-0 flex items-end justify-start">
          <Link
            href="/"
            className="group relative rounded-xs transition-transform duration-300"
            aria-label="Go to homepage"
          >
            <div className="relative mb-1 ml-2 sm:mb-2 sm:ml-3 md:mb-3 md:ml-4 lg:mb-4 lg:ml-6">
              <div className="relative rounded-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-transparent from-10% via-white/60 via-20% to-transparent">
                <Image
                  src={logo_header.src}
                  alt="Bostanci Art Header Logo"
                  width={logo_header.width}
                  height={logo_header.height}
                  className="h-auto w-32 transition-opacity duration-300 group-hover:opacity-90 sm:w-40 md:w-56 lg:w-80 xl:w-96 2xl:w-[500px]"
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 224px, (max-width: 1280px) 320px, (max-width: 1536px) 384px, 500px"
                  priority
                />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
