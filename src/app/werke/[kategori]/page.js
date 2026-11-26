import CategoryGallery from "@/components/CategoryGallery";
import JsonLd from "@/components/JsonLd";
import { getCategories, getGalleryGroups } from "@/lib/cms";
import { breadcrumbSchema, gallerySchema, galleryDescription, pageMetadata } from "@/lib/seo";

// One static page per category in the CMS; "workshop" has its own page.
export const dynamicParams = false;

async function findCategory(slug) {
  return (await getCategories()).find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.filter((c) => c.slug !== "workshop").map((c) => ({ kategori: c.slug }));
}

async function loadCategory(slug) {
  const [category, groups] = await Promise.all([findCategory(slug), getGalleryGroups(slug)]);
  const photos = groups.flatMap((g) => g.photos);
  return { category, groups, photos, description: galleryDescription(category.name, category.description, photos) };
}

export async function generateMetadata({ params }) {
  const { kategori } = await params;
  const { category, photos, description } = await loadCategory(kategori);
  return pageMetadata({ title: category.name, description, path: `/werke/${kategori}`, image: photos[0] });
}

export default async function CategoryPage({ params }) {
  const { kategori } = await params;
  const { category, groups, photos, description } = await loadCategory(kategori);
  const path = `/werke/${kategori}`;

  return (
    <>
      <JsonLd
        items={[
          gallerySchema({ name: `${category.name} von Mehmet Bostanci`, description, path, photos }),
          breadcrumbSchema([
            { name: "Werke", path: "/werke" },
            { name: category.name, path },
          ]),
        ]}
      />
      <CategoryGallery category={category} groups={groups} />
    </>
  );
}
