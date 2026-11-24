// One-time: import the existing site content into WordPress (cms.bostanci-art.de).
//
//   node scripts/cms-import/import.mjs <manifest.json> --dry-run   # checks only, no login, changes nothing
//   node scripts/cms-import/import.mjs <manifest.json>             # asks for user + Application Password
//
// Credentials are read from WP_USER / WP_APP_PASSWORD or asked interactively (hidden
// input). They are never printed or saved. Progress is stored in import-state.json next
// to the manifest, so an interrupted run can simply be started again and continues
// where it stopped.

import fs from "node:fs/promises";
import path from "node:path";
import readline from "node:readline";

const args = process.argv.slice(2);
const manifestPath = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const SITE = (args.find((a) => a.startsWith("--site="))?.slice(7) ?? "https://cms.bostanci-art.de").replace(/\/$/, "");

if (!manifestPath) {
  console.error("Usage: node import.mjs <manifest.json> [--dry-run] [--site=https://cms.example.de]");
  process.exit(1);
}

const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const statePath = path.join(path.dirname(manifestPath), "import-state.json");
const state = await fs.readFile(statePath, "utf8").then(JSON.parse).catch(() => ({}));
const saveState = () => fs.writeFile(statePath, JSON.stringify(state, null, 2));

let authHeader = null;

async function api(method, route, { json, body, headers = {}, auth = true } = {}) {
  const res = await fetch(`${SITE}/wp-json${route}`, {
    method,
    headers: {
      ...(auth && authHeader ? { Authorization: authHeader } : {}),
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    body: json ? JSON.stringify(json) : body,
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  if (!res.ok) {
    const msg = typeof data === "object" && data?.message ? data.message : String(data).slice(0, 200);
    throw new Error(`${method} ${route} -> HTTP ${res.status}: ${msg}`);
  }
  return { data, total: Number(res.headers.get("x-wp-total") ?? NaN) };
}

function ask(question, hidden = false) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

const mime = (file) => (file.endsWith(".png") ? "image/png" : "image/jpeg");

// ---------------------------------------------------------------------------
// Checks (also the whole dry run)
// ---------------------------------------------------------------------------

const allImages = [
  ...manifest.artworks.map((a) => a.image),
  ...manifest.pages.filter((p) => p.image).map((p) => p.image),
  ...manifest.extraMedia.map((m) => m.image),
];
let bytes = 0;
for (const rel of allImages) bytes += (await fs.stat(path.join(manifest.imagesDir, rel))).size;

const { data: categories } = await api("GET", "/wp/v2/kategoriler?per_page=100&_fields=id,slug", { auth: false });
const categoryId = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
const missingCategories = [...new Set(manifest.artworks.map((a) => a.category))].filter((s) => !categoryId[s]);
const { total: existingArtworks } = await api("GET", "/wp/v2/eserler?per_page=1&_fields=id", { auth: false });
const { data: publicPages } = await api("GET", "/wp/v2/pages?per_page=100&_fields=id,slug", { auth: false });
const pageClash = manifest.pages.filter((p) => publicPages.some((x) => x.slug === p.slug) && !state[`page:${p.slug}`]);

console.log(`Site:        ${SITE}`);
console.log(`Images:      ${allImages.length} files, ${(bytes / 1048576).toFixed(1)} MB, all present`);
console.log(`Artworks:    ${manifest.artworks.length} to create, ${existingArtworks} already in WordPress`);
console.log(`Categories:  ${missingCategories.length ? "MISSING " + missingCategories.join(", ") : "all present"}`);
console.log(`Pages:       ${manifest.pages.map((p) => p.slug).join(", ")}${pageClash.length ? " (ALREADY EXIST: " + pageClash.map((p) => p.slug).join(", ") + ")" : ""}`);
console.log(`Menu:        ${manifest.menu.length} items in "Ana menü"`);
console.log(`State file:  ${Object.keys(state).length ? Object.keys(state).length + " steps already done" : "new import"}`);

const problems = [];
if (missingCategories.length) problems.push("categories missing (is the Bostanci CMS plugin active?)");
if (existingArtworks > 0 && !Object.keys(state).some((k) => k.startsWith("eser:"))) {
  problems.push("WordPress already contains artworks that this import did not create; stopping to avoid duplicates");
}
if (pageClash.length) problems.push(`pages already exist: ${pageClash.map((p) => p.slug).join(", ")}`);
if (problems.length) {
  console.error("\nCannot import:\n- " + problems.join("\n- "));
  process.exit(1);
}
if (dryRun) {
  console.log("\nDry run OK. Nothing was changed.");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

const user = process.env.WP_USER || (await ask("WordPress kullanıcı adı: "));
const password = process.env.WP_APP_PASSWORD || (await ask("Uygulama şifresi (görünmez): ", true));
authHeader = "Basic " + Buffer.from(`${user}:${password}`).toString("base64");

try {
  const { data: me } = await api("GET", "/wp/v2/users/me?context=edit&_fields=name,capabilities");
  if (!me.capabilities?.manage_options) throw new Error("this user is not an administrator");
  console.log(`\nLogged in as ${me.name}.`);
} catch (err) {
  console.error(`\nLogin failed: ${err.message}`);
  console.error("Check the user name and the Application Password (Kullanıcılar → Profil → Uygulama şifreleri).");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

async function step(key, label, fn) {
  if (state[key]) return state[key];
  process.stdout.write(`${label} ... `);
  state[key] = await fn();
  await saveState();
  console.log(`ok (${state[key]})`);
  return state[key];
}

// uploadName: WordPress gives an attachment the slug of its file name, and pages share
// that slug space, so a page image must not be called like its page (ueber-mich.jpg
// would push the page to "ueber-mich-2").
async function uploadImage(rel, title, uploadName = path.basename(rel)) {
  // A run interrupted during an upload may have stored the file on the server without
  // recording it here. Reuse such an upload instead of creating a duplicate.
  const base = uploadName.replace(/\.[^.]+$/, "");
  const { data: found } = await api("GET", `/wp/v2/media?search=${encodeURIComponent(base)}&per_page=20&_fields=id,source_url`);
  const known = new Set(Object.values(state));
  const existing = found.find(
    (m) => !known.has(m.id) && path.basename(new URL(m.source_url).pathname).replace(/(-scaled)?\.[^.]+$/, "") === base,
  );

  let id = existing?.id;
  if (!id) {
    const { data } = await api("POST", "/wp/v2/media", {
      body: await fs.readFile(path.join(manifest.imagesDir, rel)),
      headers: { "Content-Type": mime(rel), "Content-Disposition": `attachment; filename="${uploadName}"` },
    });
    id = data.id;
  }
  await api("POST", `/wp/v2/media/${id}`, { json: { title, alt_text: title } });
  return id;
}

try {
  const total = manifest.artworks.length;
  for (const [i, a] of manifest.artworks.entries()) {
    const label = `[${i + 1}/${total}] ${a.key}`;
    const mediaId = await step(`media:${a.image}`, `${label} image`, () => uploadImage(a.image, a.title));
    await step(`eser:${a.key}`, `${label} artwork`, async () => {
      const { data } = await api("POST", "/wp/v2/eserler", {
        json: {
          title: a.title,
          status: "publish",
          featured_media: mediaId,
          kategoriler: [categoryId[a.category]],
          menu_order: a.order,
          meta: { grup_kodu: a.group },
        },
      });
      return data.id;
    });
  }

  for (const m of manifest.extraMedia) {
    await step(`media:${m.image}`, `Media ${m.key}`, () => uploadImage(m.image, m.title));
  }

  for (const p of manifest.pages) {
    const imageId = p.image
      ? await step(`media:${p.image}`, `Page image ${p.slug}`, () =>
          uploadImage(p.image, p.imageTitle, `seite-${p.slug}${path.extname(p.image)}`),
        )
      : 0;
    await step(`page:${p.slug}`, `Page ${p.slug}`, async () => {
      const { data } = await api("POST", "/wp/v2/pages", {
        json: { slug: p.slug, title: p.title, content: p.content, excerpt: p.excerpt, status: "publish", featured_media: imageId },
      });
      if (data.slug !== p.slug) {
        throw new Error(`page "${p.slug}" was created as "${data.slug}" (slug already taken); fix in WordPress, then run again`);
      }
      return data.id;
    });
  }

  for (const [slug, description] of Object.entries(manifest.categoryDescriptions)) {
    await step(`category-description:${slug}`, `Category text ${slug}`, async () => {
      await api("POST", `/wp/v2/kategoriler/${categoryId[slug]}`, { json: { description } });
      return categoryId[slug];
    });
  }

  const menuId = await step("menu", "Menu Ana menü", async () => {
    const { data } = await api("POST", "/wp/v2/menus", { json: { name: "Ana menü", locations: ["ana-menu"] } });
    return data.id;
  });
  for (const [i, item] of manifest.menu.entries()) {
    await step(`menu-item:${item.key}`, `Menu item ${item.key}`, async () => {
      const json = { menus: menuId, menu_order: i + 1, status: "publish", parent: item.parent ? state[`menu-item:${item.parent}`] : 0 };
      if (item.page) Object.assign(json, { type: "post_type", object: "page", object_id: state[`page:${item.page}`] });
      else if (item.category) Object.assign(json, { type: "taxonomy", object: "eser_kategori", object_id: categoryId[item.category] });
      else Object.assign(json, { type: "custom", title: item.title, url: item.url });
      const { data } = await api("POST", "/wp/v2/menu-items", { json });
      return data.id;
    });
  }
} catch (err) {
  console.error(`\n\nStopped: ${err.message}`);
  console.error("Progress is saved. Run the same command again to continue.");
  process.exit(1);
}

console.log("\nImport finished.");
console.log("Still to do by hand in WordPress → Site Ayarları: choose the home image");
console.log('("Ana sayfa görseli (Krämerbrücke)"), e-mail, address and social media links.');
