import Gallery from "@/components/Gallery";
import JsonLd from "@/components/JsonLd";
import { descriptionToBlocks, getCategories, getGalleryGroups } from "@/lib/cms";
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
  const { heading, paragraphs } = descriptionToBlocks(category.description);
  const path = `/werke/${kategori}`;
  const structuredData = (
    <JsonLd
      items={[
        gallerySchema({ name: `${category.name} von Mehmet Bostanci`, description, path, photos }),
        breadcrumbSchema([
          { name: "Werke", path: "/werke" },
          { name: category.name, path },
        ]),
      ]}
    />
  );

  // Without a description in the CMS the page is just the gallery.
  if (!heading && paragraphs.length === 0) {
    return (
      <>
        {structuredData}
        <h1 className="sr-only">{category.name} – Werke von Mehmet Bostanci</h1>
        <Gallery groups={groups} />
      </>
    );
  }

  // With a description: text next to the gallery (layout of the former logo page).
  return (
    <div className="m-4 md:mx-10 lg:mx-12">
      {structuredData}
      <div className="md:flex md:gap-12">
        <div>
          {heading && (
            <h1 className="mb-4 text-xl font-bold tracking-wide sm:text-2xl md:mb-6 md:font-serif">{heading}</h1>
          )}
          <div className="space-y-4 text-justify leading-relaxed sm:space-y-6">
            {paragraphs.map((html, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? "text-gray-800 first-letter:float-left first-letter:mt-0 first-letter:mr-3 first-letter:pt-0 first-letter:font-serif first-letter:text-6xl first-letter:leading-[0.8] sm:first-letter:text-8xl"
                    : "text-base text-gray-800 sm:text-lg [&_a]:text-blue-600 [&_a]:underline [&_a]:transition-colors [&_a]:duration-300 [&_a:hover]:text-blue-800"
                }
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end sm:mt-8 md:mt-0">
          <div className="overflow-hidden shadow-lg">
            <h2 className="mt-4 text-center text-xl font-semibold sm:text-2xl md:font-serif">
              {category.name} Portfolio
            </h2>
            <Gallery groups={groups} />
          </div>
        </div>
      </div>
    </div>
  );
}
