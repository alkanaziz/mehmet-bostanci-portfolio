"use client";

import Image from "next/image";
import { useState } from "react";

const UeberMich = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div className="mx-auto mt-4 min-h-screen max-w-3xl bg-white p-4">
      {/* Modal for enlarged image */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-h-[90vh] max-w-6xl">
            <button
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setIsImageModalOpen(false)}
            >
              Schließen ✕
            </button>
            <Image
              src="/ueber-mich.jpg"
              alt="Über mich"
              width={1200}
              height={900}
              className="max-h-[85vh] rounded-lg object-contain"
              priority
            />
          </div>
        </div>
      )}

      <div className="prose prose-lg prose-slate lg:prose-xl">
        {/* Enhanced image container */}
        <div className="group relative flex justify-center items-center float-left mb-6 mr-8 w-full md:w-[400px]">
          <div
            className="relative transform cursor-pointer overflow-hidden rounded-t-lg shadow-lg transition-all duration-300 hover:shadow-2xl md:rounded-none md:rounded-tl-lg"
            onClick={() => setIsImageModalOpen(true)}
          >
            <Image
              src="/ueber-mich.jpg"
              alt="Über mich"
              width={400}
              height={300}
              className="object-cover transition-transform duration-500 hover:scale-105"
              priority
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 opacity-0 transition-opacity duration-300 hover:bg-opacity-20 hover:opacity-100">
              <span className="rounded-full bg-black bg-opacity-50 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                Vergrößern
              </span>
            </div>
          </div>
          {/* Artist Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 text-white">
            <h1 className="mb-1 font-serif text-3xl font-bold tracking-wide">
              Mehmet Bostanci
            </h1>
            <p className="text-sm font-medium uppercase tracking-wider opacity-90">
              Malerei & Kunstlehrerin
            </p>
          </div>
        </div>

        {/* Text content with improved readability */}
        <div className="space-y-6 text-justify leading-relaxed">
          <p className="text-gray-800 [&::first-letter]:float-left [&::first-letter]:mr-3 [&::first-letter]:mt-0 [&::first-letter]:pt-0 [&::first-letter]:font-serif [&::first-letter]:text-9xl [&::first-letter]:leading-[0.8]">
            Seit meiner Geburt 1969 in der Türkei habe ich zwei große
            Leidenschaften: Malen und Unterrichten. Nach meinem Studium der
            Malerei an der Fakultät für Angewandte Kunst der Gazi-Universität in
            Ankara habe ich diese beiden Leidenschaften kombiniert und 23 Jahre
            lang als Kunstlehrer gearbeitet.
          </p>

          <p className="text-gray-800">
            Für mich war Kunst immer eine Form des Ausdrucks. Mit Farben und
            Formen kann der Mensch Dinge ausdrücken, die sich mit Worten nicht
            ausdrücken lassen. Den Mangel an Unterricht in meinem Leben
            kompensiere ich durch Malen. Besonders reizvoll ist für mich die
            Aquarelltechnik, die das Zusammenspiel von Wasser und Licht
            wunderbar wiedergibt. Ich habe auch verschiedene Druck- und
            Färbetechniken ausprobiert.
          </p>

          <p className="text-gray-800">
            Eine meiner größten Inspirationen auf meinem künstlerischen Weg war
            Vincent van Gogh. Sein Umgang mit Farben, sein kraftvoller
            Pinselstrich und seine Fähigkeit, die Natur und den menschlichen
            Geist auf die Leinwand zu übertragen, haben mich schon immer
            fasziniert. Während meiner gesamten Ausbildung las ich die Briefe,
            die er an seinen Bruder Theo schrieb, und gewann so einen Einblick
            in seine Gedankenwelt. Seine finanziellen Schwierigkeiten, seine
            Hingabe zur Kunst und sein tragisches Ende haben mich tief berührt.
            Ich versuche, die tiefsten Schichten meiner Seele in meiner eigenen
            Kunst zum Ausdruck zu bringen.
          </p>

          <p className="text-gray-800">
            Das Hauptthema meiner Arbeit sind die historischen Orte, an denen
            ich gelebt und die ich besucht habe. Das Malen alter Straßen,
            Brücken, Holztüren und Steinmauern ist für mich wie eine Reise in
            die Vergangenheit. Ich stelle mir vor, wer an diesen Orten lebt,
            welche Geschichten passieren und diese Gedanken inspirieren mich.
            Als ich zum ersten Mal durch Erfurt spazierte, war ich von der
            Architektur der Stadt begeistert. Hier kann ich durch meine Kunst
            meine Gefühle ausdrücken, die ich nicht in Worte fassen kann. Das
            Malen war die stärkste Verbindung zwischen mir und den Menschen
            hier.
          </p>

          <p className="text-gray-800">
            Ich erkenne die wahre Macht der Kunst, wenn meine Bilder die
            Emotionen meiner Betrachter berühren. Wenn auch nur eine Person von
            meiner Arbeit inspiriert wird, eine Geschichte darin findet oder
            einfach nur einen Moment des Friedens verspürt, dann weiß ich, dass
            meine Kunst ihren Zweck erfüllt hat. Sie ist nicht nur ein
            persönlicher Ausdruck, sondern auch eine universelle Sprache, die
            Brücken zwischen Kulturen und Menschen baut. Ich bin stolz, Teil
            dieser Sprache zu sein.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UeberMich;
