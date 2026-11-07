import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { siteUrl, wikiOrigin } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  const origin = host.startsWith("wiki.") ? wikiOrigin : siteUrl;
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
