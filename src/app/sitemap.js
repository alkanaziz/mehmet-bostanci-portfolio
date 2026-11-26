import { getCategories, getGalleryGroups, pageExists } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/** Image URLs of a gallery (scaled full size from the CMS) for the image sitemap. */
async function galleryImages(slug) {
  const groups = await getGalleryGroups(slug);
  return groups.flatMap((g) => g.photos.map((p) => p.full ?? p.src));
}

// All indexable pages. Placeholder pages (Neues, Shop, Aktuelle Ausstellung) are
// left out on purpose; they are also noindex.
export default async function sitemap() {
  const [categories, hasPrivacyPage] = await Promise.all([getCategories(), pageExists("datenschutz")]);
  const galleries = categories.filter((c) => c.slug !== "workshop");

  const entry = (path, priority, images) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority,
    ...(images?.length ? { images } : {}),
  });

  return [
    entry("/", 1),
    entry("/werke", 0.9),
    ...(await Promise.all(galleries.map(async (c) => entry(`/werke/${c.slug}`, 0.8, await galleryImages(c.slug))))),
    entry("/workshop", 0.7, await galleryImages("workshop")),
    entry("/ueber-mich", 0.8),
    entry("/kontakt", 0.6),
    entry("/impressum", 0.2),
    ...(hasPrivacyPage ? [entry("/datenschutz", 0.2)] : []),
  ];
}
