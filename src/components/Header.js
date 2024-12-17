import Image from "next/image";
const Header = () => {
  return (
    <header className="flex w-full flex-col items-center justify-center">
      <div className="logo_header relative h-52 w-full bg-[url('/banner.png')] bg-cover bg-[center_top_40%]">
        <Image
          className="absolute bottom-0 lg:left-[200px]"
          src="/logo_header.png"
          alt="Bostanci Art"
          width={500}
          height={200}
        />
      </div>
    </header>
  );
};

export default Header;
