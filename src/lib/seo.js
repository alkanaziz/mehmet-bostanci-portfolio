// SEO helpers: page metadata (title, description, canonical, Open Graph,
// Twitter) and JSON-LD structured data. The canonical site is always
// bostanci-art.de; the mirror on alkanaziz.com serves the same HTML but is
// noindex (public/.htaccess), so its pages point here.

import { decodeEntities, getSettings } from "@/lib/cms";

export const SITE_URL = "https://bostanci-art.de";
export const SITE_NAME = "Mehmet Bostanci Art";
export const ARTIST_NAME = "Mehmet Bostanci";
export const DEFAULT_DESCRIPTION =
  "Mehmet Bostanci – Künstler und Grafikdesigner aus Nürnberg: Aquarelle, Gemälde, digitale Werke und Logo-Design.";
export const ARTIST_ID = `${SITE_URL}/#artist`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Absolute URL with trailing slash (the site exports /route/index.html). */
export function absoluteUrl(path = "/") {
  const clean = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}/`;
  return `${SITE_URL}${clean}`;
}

/**
 * Plain-text summary of HTML for meta descriptions (about 155 characters).
 * Headings, paragraphs and blank lines become sentence ends, so a heading does
 * not run into the following text.
 */
export function describe(html = "", maxLength = 155) {
  const blocks = decodeEntities(html.replace(/<\/(h[1-6]|p|li|div)>|<br\s*\/?>|\n\s*\n/gi, "\u0000").replace(/<[^>]*>/g, " "))
    .split("\u0000")
    .map((b) => b.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const text = blocks.map((b) => (/[.!?:…]$/.test(b) ? b : `${b}.`)).join(" ");
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 80 ? cut.lastIndexOf(" ") : cut.length)}…`;
}

/** Preview image for pages without their own image: the home image. */
export async function fallbackImage() {
  return (await getSettings()).homeImage;
}

/**
 * Description of a gallery: the category text from the CMS if there is one,
 * otherwise generated from the artwork titles.
 */
export function galleryDescription(name, description, photos) {
  if (description?.trim()) return describe(description);
  const titles = [...new Set(photos.map((p) => p.alt.split("/")[0].trim()).filter(Boolean))].slice(0, 3);
  return describe(
    `${name} von Mehmet Bostanci aus Nürnberg: ${photos.length} Werke${titles.length ? `, darunter ${titles.join(", ")}` : ""}.`,
  );
}

/** Open Graph image from a CMS image (lib/cms.js); the small size loads fast in messengers. */
function ogImage(image, alt) {
  if (!image) return undefined;
  return [{ url: image.thumb ?? image.src, width: image.thumbWidth ?? image.width, height: image.thumbHeight ?? image.height, alt }];
}

/**
 * Metadata for one page.
 * image: the page's own CMS image, or the home image as fallback (pass it in).
 * noindex: hide from search engines (placeholder pages).
 */
export function pageMetadata({ title, description, path, image, noindex = false, type = "website" }) {
  const url = absoluteUrl(path);
  const images = ogImage(image, title || SITE_NAME);
  const fullTitle = title ? `${title} - ${SITE_NAME}` : `${SITE_NAME} – Aquarelle, Malerei & Grafikdesign`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: { type, url, siteName: SITE_NAME, locale: "de_DE", title: fullTitle, description, images },
    twitter: { card: "summary_large_image", title: fullTitle, description, images },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

// ---------------------------------------------------------------------------
// Structured data (schema.org JSON-LD)
// ---------------------------------------------------------------------------

/**
 * Short artist reference for creator, author, publisher etc. It carries @type and
 * name itself, because Google validates each page on its own and the full artist
 * entity (artistSchema) is only on some pages.
 */
export function artistRef() {
  return { "@type": "Person", "@id": ARTIST_ID, name: ARTIST_NAME, url: absoluteUrl("/ueber-mich") };
}

/** Short website reference (see artistRef). */
export function websiteRef() {
  return { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE_NAME, url: absoluteUrl("/") };
}

/** The full artist entity (home and Über mich). */
export function artistSchema({ settings, portrait }) {
  return {
    "@type": "Person",
    "@id": ARTIST_ID,
    name: ARTIST_NAME,
    jobTitle: "Künstler und Grafikdesigner",
    url: absoluteUrl("/ueber-mich"),
    ...(portrait ? { image: portrait.src } : {}),
    ...(settings.email ? { email: `mailto:${settings.email}` } : {}),
    address: { "@type": "PostalAddress", addressLocality: "Nürnberg", addressCountry: "DE" },
    knowsAbout: ["Aquarellmalerei", "Malerei", "Digitale Kunst", "Grafikdesign", "Logo-Design", "Ebru"],
    sameAs: settings.social.map((s) => s.url),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    inLanguage: "de",
    publisher: artistRef(),
  };
}

/**
 * One artwork image with author and copyright (shown by Google Images as
 * image metadata). Licensing requests go through the contact page.
 */
export function imageSchema(photo) {
  return {
    "@type": "ImageObject",
    contentUrl: photo.full ?? photo.src,
    thumbnailUrl: photo.thumb,
    name: photo.alt,
    caption: photo.alt,
    width: photo.width,
    height: photo.height,
    creator: artistRef(),
    creditText: ARTIST_NAME,
    copyrightHolder: artistRef(),
    copyrightNotice: `© ${ARTIST_NAME}`,
    license: absoluteUrl("/impressum"),
    acquireLicensePage: absoluteUrl("/kontakt"),
  };
}

/** A gallery page (category) with all its images. */
export function gallerySchema({ name, description, path, photos }) {
  return {
    "@type": "ImageGallery",
    "@id": `${absoluteUrl(path)}#gallery`,
    url: absoluteUrl(path),
    name,
    description,
    inLanguage: "de",
    isPartOf: websiteRef(),
    author: artistRef(),
    image: photos.map(imageSchema),
  };
}

/** Breadcrumb trail: [{ name, path }], starting below "Home". */
export function breadcrumbSchema(items) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
