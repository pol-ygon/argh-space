/** Dati strutturati schema.org (JSON-LD). Il "<" è escapato per evitare chiusure anticipate dello script. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
