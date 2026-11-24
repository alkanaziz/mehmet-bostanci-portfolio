/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for Hetzner webhosting (Apache). Upload the contents of `out/`.
  output: "export",
  // Export pages as `/route/index.html` so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  images: {
    // Required for static export: there is no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
