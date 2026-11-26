/**
 * Renders schema.org data as JSON-LD. `items` is one entity or a list; they are
 * combined into one @graph so entities can reference each other by @id.
 */
export default function JsonLd({ items }) {
  const graph = (Array.isArray(items) ? items : [items]).filter(Boolean);
  const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    // keep "</script>" in data from closing the tag early
    .replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
