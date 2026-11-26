import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

// Everything may be crawled. The mirror on alkanaziz.com serves the same file but is
// kept out of search results by its X-Robots-Tag: noindex header (public/.htaccess);
// blocking it here would hide that header from crawlers.
export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
