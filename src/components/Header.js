import Image from "next/image";
import Link from "next/link";
const Header = () => {
  return (
    <header className="flex w-full flex-col items-center justify-center">
      <div className="logo_header relative h-20 w-full bg-[url('/banner.png')] bg-cover bg-[center_top_40%] md:h-52">
        <Link href="/">
          <Image
            className="absolute bottom-0 w-56 md:w-[500px] lg:left-[12px]"
            src="/logo_header.png"
            alt="Bostanci Art"
            width={500}
            height={200}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
