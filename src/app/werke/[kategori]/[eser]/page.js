import ArtworkPage, { artworkMetadata, artworkParams } from "@/components/ArtworkPage";
import { getCategories } from "@/lib/cms";

// One static page per artwork: /werke/<category>/<WordPress slug>/
export const dynamicParams = false;

export async function generateStaticParams() {
  const categories = (await getCategories()).filter((c) => c.slug !== "workshop");
  const perCategory = await Promise.all(
    categories.map(async (c) => (await artworkParams(c.slug)).map((p) => ({ kategori: c.slug, ...p }))),
  );
  return perCategory.flat();
}

export async function generateMetadata({ params }) {
  const { kategori, eser } = await params;
  return artworkMetadata(kategori, eser);
}

export default async function Artwork({ params }) {
  const { kategori, eser } = await params;
  return <ArtworkPage categorySlug={kategori} slug={eser} />;
}
