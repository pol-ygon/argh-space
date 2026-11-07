// Sostituisce la sezione "Hardware" (it/en) con i contenuti di hardware-content.ts.
// Uso: npm run seed:hardware
//  - elimina le versioni precedenti dei gruppi "SRT Hardware Manual"
//  - ricrea le pagine dei gruppi "Hardware" (it) e "Hardware" (en)
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { clean } from "../src/lib/content";
import { group, pages } from "./hardware-content";

config({ path: ".env.local" });
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const del = await prisma.section.deleteMany({ where: { slug: { in: group.oldSlugs } } });
  if (del.count) console.log(`Eliminati ${del.count} gruppi della versione precedente (traduzione del manuale SRT)`);
  const max = await prisma.section.aggregate({ _max: { position: true } });
  let pos = (max._max.position ?? 0) + 1;
  for (const lang of ["it", "en"] as const) {
    const g = group[lang];
    const found = await prisma.section.findUnique({ where: { slug: g.slug } });
    const section = found
      ? await prisma.section.update({ where: { id: found.id }, data: { title: g.title, icon: group.icon, lang, key: group.key } })
      : await prisma.section.create({ data: { title: g.title, slug: g.slug, icon: group.icon, lang, key: group.key, position: pos++ } });
    await prisma.page.deleteMany({ where: { sectionId: section.id } });
    await prisma.page.createMany({
      data: pages.map((p, i) => ({ sectionId: section.id, slug: p[lang].slug, title: p[lang].title, content: clean(p[lang].html), key: p.key, position: i + 1 })),
    });
    console.log(`[${lang}] "${g.title}" (${g.slug}): ${pages.length} pagine`);
  }
}
main().finally(() => prisma.$disconnect());
