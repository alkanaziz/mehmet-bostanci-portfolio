// One-time: describe everything the WordPress import creates, as manifest.json.
//
//   node scripts/cms-import/build-manifest.mjs <converted-images-dir> <manifest.json>
//
// Artwork order reproduces the former site (src/components/Gallery.js): files in
// imageMeta order, aquarell newest first, then grouped by the 4-character prefix
// in order of first appearance.
//
// Already used (2026-11-24). src/data/imageMeta.json was removed afterwards because
// the site now reads WordPress; to run this again, restore it from git history:
//   git show a2f7366:src/data/imageMeta.json > src/data/imageMeta.json

import fs from "node:fs/promises";
import path from "node:path";

const [imagesDir, outFile] = process.argv.slice(2);
if (!imagesDir || !outFile) {
  console.error("Usage: node build-manifest.mjs <converted-images-dir> <manifest.json>");
  process.exit(1);
}

const repo = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const imageMeta = JSON.parse(await fs.readFile(path.join(repo, "src/data/imageMeta.json"), "utf8"));

const TOPIC_TO_CATEGORY = {
  aquarell: "aquarelle",
  "digitale-werke": "digitale-werke",
  gemaelde: "gemaelde",
  logo: "logo",
  workshop: "workshop",
};

async function convertedFile(topic, name) {
  for (const ext of ["jpg", "png"]) {
    const rel = `${topic}/${name}.${ext}`;
    try {
      await fs.access(path.join(imagesDir, rel));
      return rel;
    } catch {}
  }
  throw new Error(`Converted image missing for ${topic}/${name}`);
}

const artworks = [];
for (const topic of Object.keys(TOPIC_TO_CATEGORY)) {
  const photos = Object.values(imageMeta).filter((p) => p.topic === topic);
  if (topic === "aquarell") photos.sort((a, b) => b.id - a.id);

  const groups = new Map();
  for (const p of photos) {
    if (!groups.has(p.prefix)) groups.set(p.prefix, []);
    groups.get(p.prefix).push(p);
  }

  let order = 1;
  for (const [prefix, items] of groups) {
    for (const p of items) {
      artworks.push({
        key: p.public_id,
        image: await convertedFile(topic, p.public_id),
        title: p.alt.trim(),
        category: TOPIC_TO_CATEGORY[topic],
        group: prefix,
        order: order++,
      });
    }
  }
}

// Block markup so the texts open as normal editable blocks in WordPress.
const h = (level, text) => `<!-- wp:heading {"level":${level}} -->\n<h${level} class="wp-block-heading">${text}</h${level}>\n<!-- /wp:heading -->`;
const p = (text) => `<!-- wp:paragraph -->\n<p>${text}</p>\n<!-- /wp:paragraph -->`;
const blocks = (...parts) => parts.join("\n\n");

const pages = [
  {
    slug: "ueber-mich",
    title: "Über mich",
    excerpt: "Künstler & Grafikdesigner",
    image: "site/ueber-mich.jpg",
    imageTitle: "Mehmet Bostanci",
    content: blocks(
      p("Seit meiner Geburt 1969 in der Türkei habe ich zwei große Leidenschaften: Malen und Unterrichten. Nach meinem Studium der Malerei an der Fakultät für Angewandte Kunst der Gazi-Universität in Ankara habe ich diese beiden Leidenschaften kombiniert und 23 Jahre lang als Kunstlehrer gearbeitet."),
      p("Für mich war Kunst immer eine Form des Ausdrucks. Mit Farben und Formen kann der Mensch Dinge ausdrücken, die sich mit Worten nicht ausdrücken lassen. Den Mangel an Unterricht in meinem Leben kompensiere ich durch Malen. Besonders reizvoll ist für mich die Aquarelltechnik, die das Zusammenspiel von Wasser und Licht wunderbar wiedergibt. Ich habe auch verschiedene Druck- und Färbetechniken ausprobiert."),
      p("Eine meiner größten Inspirationen auf meinem künstlerischen Weg war Vincent van Gogh. Sein Umgang mit Farben, sein kraftvoller Pinselstrich und seine Fähigkeit, die Natur und den menschlichen Geist auf die Leinwand zu übertragen, haben mich schon immer fasziniert. Während meiner gesamten Ausbildung las ich die Briefe, die er an seinen Bruder Theo schrieb, und gewann so einen Einblick in seine Gedankenwelt. Seine finanziellen Schwierigkeiten, seine Hingabe zur Kunst und sein tragisches Ende haben mich tief berührt. Ich versuche, die tiefsten Schichten meiner Seele in meiner eigenen Kunst zum Ausdruck zu bringen."),
      p("Das Hauptthema meiner Arbeit sind die historischen Orte, an denen ich gelebt und die ich besucht habe. Das Malen alter Straßen, Brücken, Holztüren und Steinmauern ist für mich wie eine Reise in die Vergangenheit. Ich stelle mir vor, wer an diesen Orten lebt, welche Geschichten passieren und diese Gedanken inspirieren mich. Als ich zum ersten Mal durch Erfurt spazierte, war ich von der Architektur der Stadt begeistert. Hier kann ich durch meine Kunst meine Gefühle ausdrücken, die ich nicht in Worte fassen kann. Das Malen war die stärkste Verbindung zwischen mir und den Menschen hier."),
      p("Ich erkenne die wahre Macht der Kunst, wenn meine Bilder die Emotionen meiner Betrachter berühren. Wenn auch nur eine Person von meiner Arbeit inspiriert wird, eine Geschichte darin findet oder einfach nur einen Moment des Friedens verspürt, dann weiß ich, dass meine Kunst ihren Zweck erfüllt hat. Sie ist nicht nur ein persönlicher Ausdruck, sondern auch eine universelle Sprache, die Brücken zwischen Kulturen und Menschen baut. Ich bin stolz, Teil dieser Sprache zu sein."),
    ),
  },
  {
    slug: "werke",
    title: "Werke",
    excerpt: "Grafik und Malerei in verschiedenen Techniken",
    image: "site/home_img.jpg",
    imageTitle: "Bostanci Art Werke",
    content: blocks(
      h(3, "Grafik und Malerei in verschiedenen Techniken"),
      p("Der Künstler Mehmet Bostancı legt den Schwerpunkt seines Schaffens auf grafische Arbeiten, insbesondere Aquarelle. Zu seinem Werk zählen auch Zeichnungen und digitale Arbeiten, die in verschiedenen Techniken realisiert wurden. Darüber hinaus widmet er sich Pastellzeichnungen und Ölgemälden."),
      p("Ein umfassender Überblick über sein bisheriges Schaffen wird in den Bildergalerien präsentiert, die nach unterschiedlichen Techniken gegliedert sind."),
    ),
  },
  {
    slug: "kontakt",
    title: "Kontakt",
    excerpt: "",
    content: p("Haben Sie Fragen oder möchten Sie mehr über meine Kunst erfahren? Ich freue mich auf Ihre Nachricht."),
  },
  {
    slug: "impressum",
    title: "Impressum",
    excerpt: "",
    content: blocks(
      h(2, "Angaben gemäß § 5 TMG"),
      p("Mehmet Bostanci<br>Nürnberg<br>Deutschland"),
      h(2, "Kontakt"),
      p('<strong>E-Mail:</strong> <a href="mailto:info@bostanci-art.de">info@bostanci-art.de</a>'),
      h(2, "Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV"),
      p("Alkan Aziz<br>99097 Erfurt<br>Deutschland"),
      p('<strong>E-Mail:</strong> <a href="mailto:a.aziz@alkanaziz.com">a.aziz@alkanaziz.com</a>'),
      h(2, "Haftungsausschluss"),
      p("<strong>Haftung für Inhalte:</strong> Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen."),
      p("<strong>Haftung für Links:</strong> Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen."),
      h(2, "Urheberrecht"),
      p("Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers."),
    ),
  },
];

// Intro text of the logo gallery page becomes the description of the "Logo" category.
// WordPress strips most HTML from category descriptions (only links, <strong> etc. stay),
// so this is plain text with blank lines between paragraphs.
const categoryDescriptions = {
  logo: [
    "<strong>Die Bedeutung eines guten Logos für die Markenbekanntheit</strong>",
    "Das Logo ist das Gesicht einer Marke und prägt den ersten Eindruck. Ein erfolgreiches Logo zeichnet sich durch Einfachheit, Einzigartigkeit und zeitloses Design aus, wodurch sich eine Marke klar von der Konkurrenz abhebt. Ein starkes Logo ist der Schlüssel, um die Bekanntheit zu steigern und einen bleibenden Eindruck bei Kunden zu hinterlassen.",
    'Wenn Sie ein einzigartiges und professionelles Logo für Ihre Marke möchten, können Sie mich gerne unter <a href="mailto:info@bostanci-art.de">info@bostanci-art.de</a> kontaktieren.',
  ].join("\n\n"),
};

// Uploaded to the media library so it can be chosen in "Site Ayarları".
const extraMedia = [{ key: "hero", image: "site/hero_img.jpg", title: "Ana sayfa görseli (Krämerbrücke)" }];

// Menu as on the current site. "page" items point to the pages above, "category" to categories.
const menu = [
  { key: "home", title: "Home", url: "/" },
  { key: "ueber-mich", page: "ueber-mich" },
  { key: "werke", page: "werke" },
  { key: "werke-aquarelle", category: "aquarelle", parent: "werke" },
  { key: "werke-digitale-werke", category: "digitale-werke", parent: "werke" },
  { key: "werke-gemaelde", category: "gemaelde", parent: "werke" },
  { key: "werke-logo", category: "logo", parent: "werke" },
  { key: "workshop", title: "Workshop", url: "/workshop/" },
  { key: "kontakt", page: "kontakt" },
];

const manifest = { imagesDir: path.resolve(imagesDir), artworks, pages, categoryDescriptions, extraMedia, menu };
await fs.writeFile(outFile, JSON.stringify(manifest, null, 2));

const count = {};
for (const a of artworks) count[a.category] = (count[a.category] ?? 0) + 1;
console.log(`manifest written: ${artworks.length} artworks`, count, `${pages.length} pages, ${menu.length} menu items`);
