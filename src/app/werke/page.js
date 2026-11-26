import Link from "next/link";
import { BiRightArrow } from "react-icons/bi";
import JsonLd from "@/components/JsonLd";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getCategories, getPage } from "@/lib/cms";
import { absoluteUrl, breadcrumbSchema, describe, pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const page = await getPage("werke");
  return pageMetadata({ title: "Werke", description: describe(page.html), path: "/werke", image: page.image });
}

// Text and image from the CMS page "werke"; the list links every gallery category.
export default async function Werke() {
  const [page, categories] = await Promise.all([getPage("werke"), getCategories()]);
  const galleries = categories.filter((c) => c.slug !== "workshop");

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <JsonLd
        items={[
          {
            "@type": "CollectionPage",
            url: absoluteUrl("/werke"),
            name: "Werke von Mehmet Bostanci",
            description: describe(page.html),
            hasPart: galleries.map((c) => ({ "@type": "ImageGallery", name: c.name, url: absoluteUrl(`/werke/${c.slug}`) })),
          },
          breadcrumbSchema([{ name: "Werke", path: "/werke" }]),
        ]}
      />
      {page.image && (
        <div className="w-full overflow-hidden">
          <ResponsiveImage
            image={page.image}
            alt={page.image.alt || "Werke von Mehmet Bostanci"}
            sizes="(min-width: 1152px) 1152px, 100vw"
            priority
            className="h-auto w-full object-cover object-top"
          />
        </div>
      )}

      <div className="flex w-full max-w-(--breakpoint-lg) flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <h1 className="text-2xl font-bold">{page.title}</h1>
        <div className="text flex w-3/5 flex-col gap-5">
          <div className="cms-content" dangerouslySetInnerHTML={{ __html: page.html }} />
          <ul>
            {galleries.map((category) => (
              <li key={category.slug}>
                <Link className="group flex items-center gap-1 hover:underline" href={`/werke/${category.slug}`}>
                  <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                    <BiRightArrow />
                  </span>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
