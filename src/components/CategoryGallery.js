import Gallery from "@/components/Gallery";
import { descriptionToBlocks, galleryPath } from "@/lib/cms";
import { artworkPageTitle, documentTitle } from "@/lib/seo";

/**
 * A category gallery, shared by the gallery page and every artwork page of that
 * category (they look identical; an artwork page opens the lightbox on top).
 *
 * heading: the page's main heading (h1). On the gallery page it is the category
 * heading; on an artwork page the artwork title is the h1, so the category
 * heading becomes an h2 with the same look.
 */
export default function CategoryGallery({ category, groups, heading }) {
  const basePath = galleryPath(category.slug);
  // Browser tab titles while the lightbox changes the address inside the page.
  const galleryTitle = documentTitle(category.name);
  const titledGroups = groups.map((g) => ({
    ...g,
    photos: g.photos.map((p) => ({ ...p, pageTitle: documentTitle(artworkPageTitle(p, category)) })),
  }));
  const { heading: categoryHeading, paragraphs } = descriptionToBlocks(category.description);
  const CategoryHeading = heading ? "h2" : "h1";

  // Without a description in the CMS the page is just the gallery.
  if (!categoryHeading && paragraphs.length === 0) {
    return (
      <>
        <h1 className="sr-only">{heading ?? `${category.name} – Werke von Mehmet Bostanci`}</h1>
        <Gallery groups={titledGroups} basePath={basePath} galleryTitle={galleryTitle} />
      </>
    );
  }

  // With a description: text next to the gallery (layout of the former logo page).
  return (
    <div className="m-4 md:mx-10 lg:mx-12">
      {heading && <h1 className="sr-only">{heading}</h1>}
      <div className="md:flex md:gap-12">
        <div>
          {categoryHeading && (
            <CategoryHeading className="mb-4 text-xl font-bold tracking-wide sm:text-2xl md:mb-6 md:font-serif">
              {categoryHeading}
            </CategoryHeading>
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
            <Gallery groups={titledGroups} basePath={basePath} galleryTitle={galleryTitle} />
          </div>
        </div>
      </div>
    </div>
  );
}
