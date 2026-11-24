import UeberMich from "@/components/UeberMich";
import { getPage } from "@/lib/cms";

export const metadata = { title: "Über mich - Mehmet Bostanci Art" };

// Text and portrait from the CMS page "ueber-mich".
export default async function UeberMichPage() {
  return <UeberMich page={await getPage("ueber-mich")} />;
}
