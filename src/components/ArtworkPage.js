import CategoryGallery from "@/components/CategoryGallery";
import JsonLd from "@/components/JsonLd";
import { galleryPath, getCategories, getGalleryGroups } from "@/lib/cms";
import {
  artworkDescription,
  artworkPageTitle,
  artworkSchema,
  artworkShortTitle,
  breadcrumbSchema,
  pageMetadata,
  techniqueFor,
} from "@/lib/seo";

/** Category, gallery groups and the photo with this slug (null if not found). */
export async function loadArtwork(categorySlug, slug) {
  const [categories, groups] = await Promise.all([getCategories(), getGalleryGroups(categorySlug)]);
  const category = categories.find((c) => c.slug === categorySlug);
  const photo = groups.flatMap((g) => g.photos).find((p) => p.slug === slug) ?? null;
  return { category, groups, photo };
}

/** Static params ({ eser }) for all artworks of a category. */
export async function artworkParams(categorySlug) {
  const groups = await getGalleryGroups(categorySlug);
  return groups.flatMap((g) => g.photos.map((p) => ({ eser: p.slug })));
}

export async function artworkMetadata(categorySlug, slug) {
  const { category, photo } = await loadArtwork(categorySlug, slug);
  return pageMetadata({
    title: artworkPageTitle(photo, category),
    description: artworkDescription(photo, category),
    path: photo.path,
    image: photo,
    type: "article",
  });
}

/**
 * Page of one artwork: the same gallery as the category page with the lightbox
 * open on this artwork, plus its own heading and structured data.
 */
export default async function ArtworkPage({ categorySlug, slug }) {
  const { category, groups, photo } = await loadArtwork(categorySlug, slug);
  const basePath = galleryPath(categorySlug);
  const trail =
    categorySlug === "workshop"
      ? [{ name: "Workshop", path: basePath }]
      : [
          { name: "Werke", path: "/werke" },
          { name: category.name, path: basePath },
        ];

  return (
    <>
      <JsonLd
        items={[
          artworkSchema(photo, category),
          breadcrumbSchema([...trail, { name: artworkShortTitle(photo.alt), path: photo.path }]),
        ]}
      />
      <CategoryGallery category={category} groups={groups} heading={`${photo.alt} – ${techniqueFor(category)} von Mehmet Bostanci`} />
    </>
  );
}
