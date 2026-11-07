import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

export type { Section, Page } from "@/generated/prisma/client";

const g = globalThis as unknown as { _prisma?: PrismaClient };

function make() {
  // Su Vercel (serverless) si usa la connessione "pooled"; in locale quella diretta.
  const connectionString = process.env.DATABASE_URL_POOLED || process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL non impostata");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 3 }) });
}
export const prisma = g._prisma ?? (g._prisma = make());

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "pagina";

const order = [{ position: "asc" as const }, { title: "asc" as const }];

export const sections = () => prisma.section.findMany({ orderBy: order });
/** Sezioni con le loro pagine (di default solo quelle pubblicate). */
export const sectionsWithPages = (onlyPublished = true, lang?: string) =>
  prisma.section.findMany({
    where: lang ? { lang } : {},
    orderBy: [{ lang: "desc" as const }, ...order],
    include: { pages: { where: onlyPublished ? { published: true } : {}, orderBy: order } },
  });
export const sectionBySlug = (slug: string) => prisma.section.findUnique({ where: { slug } });
export const pagesOf = (sectionId: number, onlyPublished = true) =>
  prisma.page.findMany({ where: { sectionId, ...(onlyPublished ? { published: true } : {}) }, orderBy: order });
export const pageBySlug = (sectionId: number, slug: string) =>
  prisma.page.findUnique({ where: { sectionId_slug: { sectionId, slug } } });
export const pageById = (id: number) => prisma.page.findUnique({ where: { id }, include: { section: true } });
export const recentPages = (take = 5) =>
  prisma.page.findMany({ where: { published: true }, orderBy: { updatedAt: "desc" }, take, include: { section: true } });
/** Traduzioni della stessa pagina (stessa "key", altro gruppo/lingua), solo pubblicate. */
export const alternates = (pg: { id: number; key: string | null }) =>
  pg.key ? prisma.page.findMany({ where: { key: pg.key, id: { not: pg.id }, published: true }, include: { section: true } }) : Promise.resolve([]);
