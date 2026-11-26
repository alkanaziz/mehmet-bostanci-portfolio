import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import { getCategories, getGalleryGroups } from "@/lib/cms";
import { breadcrumbSchema, gallerySchema, galleryDescription, pageMetadata } from "@/lib/seo";

async function loadWorkshop() {
  const [categories, groups] = await Promise.all([getCategories(), getGalleryGroups("workshop")]);
  const category = categories.find((c) => c.slug === "workshop");
  const photos = groups.flatMap((g) => g.photos);
  return { groups, photos, description: galleryDescription("Workshop", category?.description, photos) };
}

export async function generateMetadata() {
  const { photos, description } = await loadWorkshop();
  return pageMetadata({ title: "Workshop", description, path: "/workshop", image: photos[0] });
}

// Artworks of the CMS category "Workshop".
export default async function Workshop() {
  const { groups, photos, description } = await loadWorkshop();
  return (
    <>
      <JsonLd
        items={[
          gallerySchema({ name: "Workshop – Mehmet Bostanci", description, path: "/workshop", photos }),
          breadcrumbSchema([{ name: "Workshop", path: "/workshop" }]),
        ]}
      />
      <h1 className="sr-only">Workshop – Mehmet Bostanci</h1>
      <Gallery groups={groups} />
    </>
  );
}
