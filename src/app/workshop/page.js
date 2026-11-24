import Gallery from "@/components/Gallery";
import { getGalleryGroups } from "@/lib/cms";

export const metadata = { title: "Workshop - Mehmet Bostanci Art" };

// Artworks of the CMS category "Workshop".
export default async function Workshop() {
  return <Gallery groups={await getGalleryGroups("workshop")} />;
}
