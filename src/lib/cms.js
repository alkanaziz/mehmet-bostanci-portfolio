// Build-time data from the WordPress CMS (cms.bostanci-art.de).
//
// The site is a static export: everything here runs during `next build` only.
// If the CMS cannot be reached the build fails on purpose, so an empty site is
// never published. Set CMS_URL to use another WordPress (e.g. a local test).

import { cache } from "react";

const CMS_URL = (process.env.CMS_URL || "https://cms.bostanci-art.de").replace(/\/$/, "");

async function request(route) {
  const res = await fetch(`${CMS_URL}/wp-json${route}`, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`CMS request failed: ${route} -> HTTP ${res.status}`);
  }
  return { data: await res.json(), totalPages: Number(res.headers.get("x-wp-totalpages") || 1) };
}

async function requestAll(route) {
  const separator = route.includes("?") ? "&" : "?";
  const first = await request(`${route}${separator}per_page=100&page=1`);
  const items = [...first.data];
  for (let page = 2; page <= first.totalPages; page++) {
    items.push(...(await request(`${route}${separator}per_page=100&page=${page}`)).data);
  }
  return items;
}

/** WordPress returns HTML entities in titles (&amp;, &#038;, &#8211; ...). */
export function decodeEntities(text = "") {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] ?? match);
}

const stripTags = (html = "") => decodeEntities(html.replace(/<[^>]*>/g, "")).trim();

/** Links in the site use paths without a trailing slash; next.config adds it. */
function normalizePath(path) {
  if (!path || path === "/") return "/";
  return path.replace(/\/+$/, "");
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/** Tiny blurred preview shown while the real image loads. */
const blurDataUrl = cache(async (url) => {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return undefined;
    const { default: sharp } = await import("sharp");
    const tiny = await sharp(Buffer.from(await res.arrayBuffer()))
      .resize(10, 10, { fit: "inside" })
      .jpeg({ quality: 60 })
      .toBuffer();
    return `data:image/jpeg;base64,${tiny.toString("base64")}`;
  } catch {
    return undefined; // a missing preview must not break the build
  }
});

/** Picks the first available size; WordPress sizes fall back to the full image. */
function pickSize(sizes, names, full) {
  for (const name of names) {
    if (sizes?.[name]) return sizes[name];
  }
  return full;
}

/** From the plugin's `gorsel` field or a page's embedded featured media. */
async function toImage(source, alt) {
  if (!source) return null;
  const full = { url: source.url, width: source.width, height: source.height };
  const sizes = source.sizes ?? {};
  const large = pickSize(sizes, ["1536x1536", "large"], full);
  const thumb = pickSize(sizes, ["medium_large", "large"], full);
  return {
    alt: alt || source.alt || "",
    src: large.url,
    width: large.width,
    height: large.height,
    thumb: thumb.url,
    thumbWidth: thumb.width,
    thumbHeight: thumb.height,
    full: full.url,
    blurDataUrl: await blurDataUrl(thumb.url),
  };
}

function embeddedMedia(item) {
  const media = item._embedded?.["wp:featuredmedia"]?.[0];
  if (!media?.media_details) return null;
  const details = media.media_details;
  const sizes = Object.fromEntries(
    Object.entries(details.sizes ?? {}).map(([name, s]) => [name, { url: s.source_url, width: s.width, height: s.height }]),
  );
  return { url: media.source_url, width: details.width, height: details.height, alt: media.alt_text, sizes };
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

export const getCategories = cache(async () => {
  const categories = await requestAll("/wp/v2/kategoriler?_fields=id,slug,name,count,description");
  return categories
    .map((c) => ({ id: c.id, slug: c.slug, name: decodeEntities(c.name), count: c.count, description: c.description }))
    .sort((a, b) => a.name.localeCompare(b.name, "de"));
});

const getArtworks = cache(async () => {
  const items = await requestAll("/wp/v2/eserler?_fields=id,date,title,menu_order,meta,kategoriler,gorsel");
  const artworks = await Promise.all(
    items
      .filter((item) => item.gorsel) // artworks without an image are not shown
      .map(async (item) => {
        const title = decodeEntities(item.title.rendered);
        return {
          id: item.id,
          title,
          date: item.date,
          order: item.menu_order,
          group: item.meta?.grup_kodu || "",
          categoryIds: item.kategoriler,
          image: await toImage(item.gorsel, title),
        };
      }),
  );
  // Order set by drag and drop in WordPress; newest first where it is equal (e.g. new items).
  return artworks.sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
});

/**
 * Artworks of one category, grouped for the gallery rows: artworks with the same
 * group code are shown side by side, in the order their group first appears.
 */
export const getGalleryGroups = cache(async (categorySlug) => {
  const category = (await getCategories()).find((c) => c.slug === categorySlug);
  if (!category) return [];
  const groups = new Map();
  for (const artwork of await getArtworks()) {
    if (!artwork.categoryIds.includes(category.id)) continue;
    const key = artwork.group || `single-${artwork.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ id: artwork.id, ...artwork.image });
  }
  return [...groups].map(([key, photos]) => ({ key, photos }));
});

export const getPage = cache(async (slug) => {
  const { data } = await request(
    `/wp/v2/pages?slug=${encodeURIComponent(slug)}&_embed=wp:featuredmedia&_fields=title,excerpt,content,_links,_embedded`,
  );
  const page = data[0];
  if (!page) {
    throw new Error(`CMS page "${slug}" not found`);
  }
  const title = decodeEntities(page.title.rendered);
  return {
    title,
    excerpt: stripTags(page.excerpt.rendered),
    html: page.content.rendered,
    image: await toImage(embeddedMedia(page), title),
  };
});

/** True if a published page with this slug exists (e.g. an optional "datenschutz"). */
export const pageExists = cache(async (slug) => {
  const { data } = await request(`/wp/v2/pages?slug=${encodeURIComponent(slug)}&_fields=id`);
  return data.length > 0;
});

function socialLabel(url) {
  const { hostname, pathname } = new URL(url);
  const handle = pathname.split("/").filter(Boolean)[0];
  return hostname.includes("instagram.com") && handle ? `@${handle}` : hostname.replace(/^www\./, "");
}

export const getSettings = cache(async () => {
  const { data } = await request("/bostanci/v1/ayarlar");
  const social = (data.social ?? [])
    .filter((url) => {
      try {
        return new URL(url).hostname.includes("."); // skips broken entries such as "https://Array"
      } catch {
        return false;
      }
    })
    .map((url) => ({ url, label: socialLabel(url) }));
  return {
    email: data.email || "",
    address: data.address || "",
    social,
    homeImage: await toImage(data.home_image),
  };
});

/** Menu as a tree: [{ title, link, subMenu? }] (the shape the nav components use). */
export const getMenu = cache(async () => {
  const { data } = await request("/bostanci/v1/menu");
  const items = data.map((item) => ({ id: item.id, parent: item.parent, title: decodeEntities(item.title), link: normalizePath(item.path) }));
  return items
    .filter((item) => !item.parent)
    .map(({ id, title, link }) => {
      const children = items.filter((child) => child.parent === id).map(({ title, link }) => ({ title, link }));
      return children.length ? { title, link, subMenu: children } : { title, link };
    });
});

/** Path -> title, for the breadcrumb. */
export const getPageTitles = cache(async () => {
  const titles = {
    "/impressum": "Impressum",
    "/datenschutz": "Datenschutz",
    "/neues": "Neues",
    "/shop": "Shop",
    "/aktuelle-ausstellung": "Aktuelle Ausstellung",
  };
  for (const category of await getCategories()) titles[`/werke/${category.slug}`] = category.name;
  const addMenu = (items) => {
    for (const item of items) {
      titles[item.link] = item.title;
      if (item.subMenu) addMenu(item.subMenu);
    }
  };
  addMenu(await getMenu());
  return titles;
});

/**
 * A category description is plain text with blank lines between paragraphs
 * (WordPress allows only links and simple formatting there). A first paragraph
 * that is entirely bold is used as the heading.
 */
export function descriptionToBlocks(description = "") {
  const paragraphs = description
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const headingMatch = paragraphs[0]?.match(/^<strong>(.*)<\/strong>$/s);
  return headingMatch
    ? { heading: decodeEntities(headingMatch[1]), paragraphs: paragraphs.slice(1) }
    : { heading: "", paragraphs };
}
