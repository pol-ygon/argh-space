// Indirizzi canonici. Impostare NEXT_PUBLIC_SITE_URL e NEXT_PUBLIC_WIKI_URL (assoluti) in produzione.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://argh.space").replace(/\/$/, "");
const w = process.env.NEXT_PUBLIC_WIKI_URL || "";
export const wikiOrigin = /^https?:\/\//.test(w) ? w.replace(/\/$/, "") : `${siteUrl}/wiki`;
export const wikiSectionUrl = (section: string) => `${wikiOrigin}/${section}`;
export const wikiPageUrl = (section: string, page: string) => `${wikiOrigin}/${section}/${page}`;
