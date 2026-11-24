import Image from "next/image";
import Link from "next/link";
import { BiRightArrow } from "react-icons/bi";
import { getCategories, getPage } from "@/lib/cms";

const DESCRIPTION =
  "Entdecken Sie die Kunstwerke von Mehmet Bostancı - Aquarelle, Digitale Werke, Gemälde und Logo-Designs.";

export async function generateMetadata() {
  const { image } = await getPage("werke");
  const images = image ? [{ url: image.src, width: image.width, height: image.height, alt: "Bostanci Art Werke" }] : [];
  return {
    metadataBase: new URL("https://bostanci-art.de"),
    title: "Werke - Mehmet Bostanci Art",
    description: DESCRIPTION,
    openGraph: { title: "Werke - Mehmet Bostanci Art", description: DESCRIPTION, images },
    twitter: { card: "summary_large_image", title: "Werke - Mehmet Bostanci Art", description: DESCRIPTION, images },
  };
}

// Text and image from the CMS page "werke"; the list links every gallery category.
export default async function Werke() {
  const [page, categories] = await Promise.all([getPage("werke"), getCategories()]);
  const galleries = categories.filter((c) => c.slug !== "workshop");

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {page.image && (
        <div className="w-full overflow-hidden">
          <Image
            className="w-full object-cover object-top"
            src={page.image.src}
            alt="Bostanci Art Werke Page Image"
            width={page.image.width}
            height={page.image.height}
            placeholder={page.image.blurDataUrl ? "blur" : "empty"}
            blurDataURL={page.image.blurDataUrl}
          />
        </div>
      )}

      <div className="flex w-full max-w-(--breakpoint-lg) flex-col items-center gap-5 sm:flex-row sm:items-start sm:justify-between sm:px-10">
        <h2 className="text-2xl font-bold">{page.title}</h2>
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
