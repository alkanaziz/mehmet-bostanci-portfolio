# WordPress CMS (cms.bostanci-art.de)

WordPress is used only as an admin panel ("headless"). The public site stays the
static Next.js export; it reads the content from the WordPress REST API at build time.

## Plugin `bostanci-cms`

Install: upload the folder `bostanci-cms/` to `wp-content/plugins/` and activate it.

It provides:

- **Eserler** (artworks): image, caption (title), category, group code, drag-and-drop order
- **Kategoriler**: new categories get their own gallery page `/werke/<slug>/`
- **Site Ayarları**: home image, e-mail, address, social media links
- **Menü** location "Ana menü" (editors may edit it)
- Automatic rebuild: every published change triggers GitHub Actions (`repository_dispatch`, type `cms-update`)
- Hardening: front end redirects to bostanci-art.de, XML-RPC off, user list hidden from anonymous visitors

### Public REST endpoints used by the build

| Data | Endpoint |
|---|---|
| Artworks | `/wp-json/wp/v2/eserler?per_page=100&page=N` (fields: `title`, `menu_order`, `meta.grup_kodu`, `kategoriler`, `gorsel`) |
| Categories | `/wp-json/wp/v2/kategoriler?per_page=100` |
| Pages | `/wp-json/wp/v2/pages?per_page=100` |
| Settings | `/wp-json/bostanci/v1/ayarlar` |
| Menu | `/wp-json/bostanci/v1/menu` |

### Enabling automatic rebuilds

Add to `wp-config.php` (never commit the token):

```php
define( 'BOSTANCI_GITHUB_REPO', 'alkanaziz/mehmet-bostanci-portfolio' );
define( 'BOSTANCI_GITHUB_TOKEN', '<fine-grained token>' );
```

Token: GitHub → Settings → Developer settings → Fine-grained tokens. Repository
access: only this repository. Permission: **Contents: Read and write** (required
for `repository_dispatch`). Set an expiry date and renew it before it runs out.

## Image guidelines

JPEG, sRGB, long edge 2500–3000 px, quality about 85 % (usually 1–3 MB).
WordPress keeps a scaled copy of at most 2560 px; the site never links the original upload.
