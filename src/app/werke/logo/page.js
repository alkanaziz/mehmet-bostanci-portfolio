"use client";

import Gallery from "@/components/Gallery";

const Logo = () => {
  return (
    <div className="m-4 md:mx-10 lg:mx-12">
      {/* Flex container for side-by-side layout */}
      <div className="md:flex md:gap-12">
        {/* Text content container */}
        <div className="">
          {/* Title with enhanced styling */}
          <h1 className="mb-4 text-xl font-bold tracking-wide sm:text-2xl md:mb-6 md:font-serif">
            Die Bedeutung Eines Guten Logos Für Die Markenbekanntheit
          </h1>

          {/* Main text content */}
          <div className="space-y-4 text-justify leading-relaxed sm:space-y-6">
            <p className="text-gray-800 [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-0 [&::first-letter]:pt-0 [&::first-letter]:font-serif [&::first-letter]:text-6xl [&::first-letter]:leading-[0.8] sm:[&::first-letter]:text-8xl">
              Das Logo ist das Gesicht einer Marke und prägt den ersten
              Eindruck. Ein erfolgreiches Logo zeichnet sich durch Einfachheit,
              Einzigartigkeit und zeitloses Design aus, wodurch sich eine Marke
              klar von der Konkurrenz abhebt. Ein starkes Logo ist der
              Schlüssel, um die Bekanntheit zu steigern und einen bleibenden
              Eindruck bei Kunden zu hinterlassen.
            </p>

            {/* Contact information */}
            <p className="text-base text-gray-800 sm:text-lg">
              Wenn Sie ein einzigartiges und professionelles Logo für Ihre Marke
              möchten, können Sie mich gerne unter{" "}
              <a
                href="mailto:info@bostanci-art.de"
                className="text-blue-600 underline transition-colors duration-300 hover:text-blue-800"
              >
                info@bostanci-art.de
              </a>{" "}
              kontaktieren.
            </p>
          </div>
        </div>

        {/* Gallery section */}
        <div className="mt-6 flex justify-end sm:mt-8 md:mt-0">
          <div className="overflow-hidden shadow-lg">
            <h2 className="mt-4 text-center text-xl font-semibold sm:text-2xl md:font-serif">
              Logo Portfolio
            </h2>
            <Gallery topic="logo" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;
