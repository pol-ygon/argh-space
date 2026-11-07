import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sectionBySlug, pagesOf } from "@/lib/db";
import { wikiBase } from "@/lib/wikibase";
import { excerpt } from "@/lib/content";
import { wikiSectionUrl } from "@/lib/seo";
import { Icon } from "../../icons";

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const s = await sectionBySlug((await params).section);
  if (!s) return {};
  const pages = await pagesOf(s.id);
  return {
    title: s.title,
    description: `${s.title}: ${pages.slice(0, 4).map((p) => p.title).join(", ")}.`,
    alternates: { canonical: wikiSectionUrl(s.slug) },
    openGraph: { locale: s.lang === "en" ? "en_US" : "it_IT" },
    robots: pages.length ? undefined : { index: false, follow: true },
  };
}

export default async function SectionPage({ params }: { params: Promise<{ section: string }> }) {
  const s = await sectionBySlug((await params).section);
  if (!s) notFound();
  const base = await wikiBase();
  return (
    <>
      <nav className="crumbs"><Link href={base || "/"}>Wiki</Link><span>/</span><b>{s.title}</b></nav>
      <div className="shead"><div className="ico"><Icon name={s.icon} /></div><h1>{s.title}</h1></div>
      <div className="pgrid">
        {(await pagesOf(s.id)).map((p) => (
          <Link key={p.id} href={`${base}/${s.slug}/${p.slug}`} className="card">
            <h3>{p.title}</h3><p>{excerpt(p.content)}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
