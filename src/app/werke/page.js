import Image from "next/image";
import Link from "next/link";
import { BiRightArrow } from "react-icons/bi";
import publicImageMeta from "@/data/publicImageMeta";

const Werke = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="w-full overflow-hidden">
        <Image
          className="w-full object-cover object-top"
          src={publicImageMeta.home_img.src}
          alt="Bostanci Art Werke Page Image"
          width={publicImageMeta.home_img.width}
          height={publicImageMeta.home_img.height}
          placeholder="blur"
          blurDataURL={publicImageMeta.home_img.blurDataUrl}
        />
      </div>

      <div className="flex w-full max-w-screen-lg flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <h2 className="text-2xl font-bold">Werke</h2>
        <div className="text flex w-3/5 flex-col gap-5">
          <h3 className="text-xl text-gray-500">
            Grafik und Malerei in verschiedenen Techniken
          </h3>
          <p>
            Der Künstler Mehmet Bostancı legt den Schwerpunkt seines Schaffens
            auf grafische Arbeiten, insbesondere Aquarelle. Zu seinem Werk
            zählen auch Zeichnungen und digitale Arbeiten, die in verschiedenen
            Techniken realisiert wurden. Darüber hinaus widmet er sich
            Pastellzeichnungen und Ölgemälden.
          </p>
          <p>
            Ein umfassender Überblick über sein bisheriges Schaffen wird in den
            Bildergalerien präsentiert, die nach unterschiedlichen Techniken
            gegliedert sind:
          </p>
          <ul>
            <li>
              <Link
                className="group flex items-center gap-1 hover:underline"
                href="/werke/aquarelle"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  <BiRightArrow />
                </span>
                Aquarelle
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-1 hover:underline"
                href="/werke/digitale-werke"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  <BiRightArrow />
                </span>
                Digitale Werke
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-1 hover:underline"
                href="/werke/gemaelde"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  <BiRightArrow />
                </span>
                Gemälde
              </Link>
            </li>
            <li>
              <Link
                className="group flex items-center gap-1 hover:underline"
                href="/werke/logo"
              >
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  <BiRightArrow />
                </span>
                Logo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Werke;
