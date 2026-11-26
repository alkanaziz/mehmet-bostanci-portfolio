import { galleryPath, getCategories, getGalleryGroups, pageExists } from "@/lib/cms";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

// All indexable pages. Placeholder pages (Neues, Shop, Aktuelle Ausstellung) are
// left out on purpose; they are also noindex.
export default async function sitemap() {
  const [categories, hasPrivacyPage] = await Promise.all([getCategories(), pageExists("datenschutz")]);
  const workshop = categories.find((c) => c.slug === "workshop");
  const galleries = categories.filter((c) => c.slug !== "workshop");

  const entry = (path, priority, images) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority,
    ...(images?.length ? { images } : {}),
  });

  // A gallery page lists all its images; every artwork has its own page with its image.
  async function galleryEntries(category, priority) {
    const photos = (await getGalleryGroups(category.slug)).flatMap((g) => g.photos);
    const imageOf = (p) => p.full ?? p.src;
    return [
      entry(galleryPath(category.slug), priority, photos.map(imageOf)),
      ...photos.map((p) => entry(p.path, priority - 0.1, [imageOf(p)])),
    ];
  }

  const galleryPages = await Promise.all([
    ...galleries.map((c) => galleryEntries(c, 0.8)),
    ...(workshop ? [galleryEntries(workshop, 0.7)] : []),
  ]);

  return [
    entry("/", 1),
    entry("/werke", 0.9),
    ...galleryPages.flat(),
    entry("/ueber-mich", 0.8),
    entry("/kontakt", 0.6),
    entry("/impressum", 0.2),
    ...(hasPrivacyPage ? [entry("/datenschutz", 0.2)] : []),
  ];
}
