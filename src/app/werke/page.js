import Image from "next/image";

const Werke = () => {
  return (
    <div className="flex w-full flex-col items-center gap-10 sm:h-[80rem]">
      <div className="h-3/5 w-full overflow-hidden">
        <Image
          className="w-full object-cover object-top"
          src="/home_img.png"
          alt="Bostanci Art"
          width={1500}
          height={2024}
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
            Pastellzei- chnungen und Ölgemälden.
          </p>
          <p>
            Ein umfassender Überblick über sein bisheriges Schaffen wird in den
            Bildergalerien präsentiert, die nach unterschiedlichen Techniken
            gegliedert sind:
          </p>
          <ul>
            <li>
              <a href="/werke/digitale-werke">Digitale Werke</a>
            </li>
            <li>
              <a href="/werke/aquarelle">Aquarelle</a>
            </li>
            <li>
              <a href="/werke/gemaelde">Gemälde</a>
            </li>
            <li>
              <a href="/werke/pastellarbeiten">Pastellarbeiten</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Werke;
