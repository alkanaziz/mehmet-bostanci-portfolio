import Image from "next/image";
const Header = () => {
  return (
    <header className="flex w-full flex-col items-center justify-center">
      <div className="logo_header relative h-20 md:h-52 w-full bg-[url('/banner.png')] bg-cover bg-[center_top_40%]">
        <Image
          className="absolute w-56 md:w-[500px] bottom-0 lg:left-[200px]"
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
