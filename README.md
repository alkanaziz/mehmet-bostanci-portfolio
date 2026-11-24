# Mehmet Bostancı – Artist Portfolio

Static portfolio site for the artist Mehmet Bostancı.

| | |
|---|---|
| Live site | https://bostanci-art.de (indexed) |
| Mirror | https://bostanci-art.alkanaziz.com (same build, `noindex`) |
| Content (CMS) | https://cms.bostanci-art.de/wp-admin (WordPress, headless) |
| Hosting | Hetzner Webhosting S (Apache), static files only |

## How it works

```
WordPress (cms.bostanci-art.de)          GitHub Actions                     Hetzner webhosting
  artworks, pages, menu, settings  --->  next build (static export)  --->  bostanci-art.de
  "Publish" sends repository_dispatch    reads the CMS via REST API        bostanci-art.alkanaziz.com
                                         uploads out/ via SFTP
```

- **Next.js 16** (App Router) with `output: "export"` and `trailingSlash: true`; no Node.js on the server.
- All content comes from WordPress at build time: [`src/lib/cms.js`](src/lib/cms.js). The build fails if the CMS is unreachable, so an empty site is never published.
- Images are served from the CMS (`cms.bostanci-art.de/wp-content/uploads`); galleries use the 768 px size, the lightbox the large size.
- Apache rules (HTTPS, www redirect, noindex for the mirror, caching, security headers): [`public/.htaccess`](public/.htaccess), copied into `out/`.
- WordPress plugin (artworks, categories, settings, menu, rebuild trigger): [`wordpress/`](wordpress/README.md).

## Development

Requires Node.js 22 (see `.nvmrc`).

```bash
npm ci
npm run dev        # http://localhost:3000, reads the live CMS
npm run build      # static export into out/
```

`CMS_URL` points the build to another WordPress, e.g. a local test instance.

## Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and uploads the site:

- on every push to `main`,
- when content is published in WordPress (`repository_dispatch` type `cms-update`),
- manually: GitHub → Actions → "Build and deploy" → "Run workflow".

Pull requests are only built (check), not deployed.

Each target is a GitHub **environment** (`bostanci-art.de`, `bostanci-art.alkanaziz.com`) with the secrets
`SFTP_HOST`, `SFTP_USER`, `SFTP_PASSWORD` and `SFTP_PATH` (the folder the site is served from).
The upload never deletes anything outside `_next/`, so the WordPress folder and other server files are safe.
After the upload the workflow checks that the live `index.html` matches the build.

**Rollback:** GitHub → Actions → pick an earlier successful "Build and deploy" run → "Re-run all jobs".
That rebuilds the code of that commit with the current CMS content.

## Content

Artworks, categories, pages ("Über mich", "Werke", "Kontakt", "Impressum"), the menu and "Site Ayarları"
(home image, contact data, social media) are edited in WordPress. Image guidelines: JPEG, sRGB,
long edge 2500–3000 px, quality about 85 %.

The original artwork files are archived outside this repository.
