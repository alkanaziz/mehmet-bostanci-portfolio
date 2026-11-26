import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Nav from "@/components/navbar/Nav";
import Breadcrumb from "@/components/Breadcrumb";
import { getMenu, getPageTitles, getSettings, pageExists } from "@/lib/cms";
import { ARTIST_NAME, DEFAULT_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

// Defaults; every page sets its own title, description, canonical and preview (lib/seo.js).
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: ARTIST_NAME, url: `${SITE_URL}/ueber-mich/` }],
  creator: ARTIST_NAME,
};

export default async function RootLayout({ children }) {
  const [menu, titles, settings, hasPrivacyPage] = await Promise.all([
    getMenu(),
    getPageTitles(),
    getSettings(),
    pageExists("datenschutz"),
  ]);

  return (
    <html lang="de">
      <body
        className="mx-auto flex min-h-screen max-w-6xl flex-col border-gray-500 bg-white text-black antialiased shadow-xl"
      >
        <Header />
        <Nav menuItems={menu} />
        <Breadcrumb titles={titles} />
        <main id="inhalt" className="w-full">
          {children}
        </main>
        <Footer settings={settings} hasPrivacyPage={hasPrivacyPage} />
      </body>
    </html>
  );
}
