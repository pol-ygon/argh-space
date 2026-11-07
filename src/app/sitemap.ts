import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { sectionsWithPages } from "@/lib/db";
import { siteUrl, wikiOrigin } from "@/lib/seo";

// Una sitemap per host: argh.space elenca il sito, wiki.argh.space le pagine della wiki.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const host = (await headers()).get("host") ?? "";
  if (host.startsWith("wiki.")) {
    const sections = await sectionsWithPages();
    const last = (d: Date) => d;
    return [
      { url: wikiOrigin, changeFrequency: "weekly", priority: 1 },
      ...sections.filter((s) => s.pages.length).flatMap((s) => [
        { url: `${wikiOrigin}/${s.slug}`, changeFrequency: "weekly" as const, priority: 0.7 },
        ...s.pages.map((p) => ({ url: `${wikiOrigin}/${s.slug}/${p.slug}`, lastModified: last(p.updatedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
      ]),
    ];
  }
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/cookie`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
