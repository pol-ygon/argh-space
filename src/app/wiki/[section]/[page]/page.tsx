import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, Pencil, Languages } from "lucide-react";
import { JsonLd } from "../../../jsonld";
import { Prose } from "../../../prose";
import { wikiOrigin, wikiPageUrl, wikiSectionUrl, siteUrl } from "@/lib/seo";
import { sectionBySlug, pageBySlug, pagesOf, alternates } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { render, readingMinutes, excerpt } from "@/lib/content";
import { wikiBase, fmtDate } from "@/lib/wikibase";
import { wikiText, asWLang } from "@/lib/i18n/wiki";

type Params = { params: Promise<{ section: string; page: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await params;
  const s = await sectionBySlug(p.section);
  const pg = s && (await pageBySlug(s.id, p.page));
  if (!s || !pg) return {};
  const url = wikiPageUrl(s.slug, pg.slug);
  const description = excerpt(pg.content, 160) || `${pg.title} – ${s.title}`;
  const alts = await alternates(pg);
  return {
    title: pg.title,
    description,
    alternates: {
      canonical: url,
      // hreflang: la stessa pagina nelle altre lingue
      languages: Object.fromEntries([[s.lang, url], ...alts.map((a) => [a.section.lang, wikiPageUrl(a.section.slug, a.slug)])]),
    },
    robots: pg.published ? undefined : { index: false, follow: false },
    openGraph: { type: "article", url, title: pg.title, description, siteName: "A.R.G.H. Wiki", modifiedTime: pg.updatedAt.toISOString(), section: s.title, locale: s.lang === "en" ? "en_US" : "it_IT" },
    twitter: { card: "summary_large_image", title: pg.title, description },
  };
}

export default async function WikiPage({ params }: Params) {
  const p = await params;
  const s = await sectionBySlug(p.section);
  const pg = s && (await pageBySlug(s.id, p.page));
  const admin = await isAdmin();
  if (!s || !pg || (!pg.published && !admin)) notFound();
  const base = await wikiBase();
  const L = asWLang(s.lang), T = wikiText[L];
  const { html, toc } = render(pg.content);
  const siblings = await pagesOf(s.id);
  const i = siblings.findIndex((x) => x.id === pg.id);
  const prev = siblings[i - 1], next = siblings[i + 1];
  const alts = await alternates(pg);
  const url = (x: { slug: string }) => `${base}/${s.slug}/${x.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle", headline: pg.title, description: excerpt(pg.content, 160), inLanguage: L,
        dateModified: pg.updatedAt.toISOString(), mainEntityOfPage: wikiPageUrl(s.slug, pg.slug), articleSection: s.title,
        author: { "@type": "Organization", name: "A.R.G.H.", url: siteUrl }, publisher: { "@type": "Organization", name: "A.R.G.H.", url: siteUrl, logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` } },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Wiki", item: wikiOrigin },
          { "@type": "ListItem", position: 2, name: s.title, item: wikiSectionUrl(s.slug) },
          { "@type": "ListItem", position: 3, name: pg.title, item: wikiPageUrl(s.slug, pg.slug) },
        ],
      },
    ],
  };
  return (
    <div className="dgrid" lang={L}>
      {pg.published && <JsonLd data={ld} />}
      <article>
        <nav className="crumbs"><Link href={base || "/"}>Wiki</Link><span>/</span><Link href={`${base}/${s.slug}`}>{s.title}</Link></nav>
        <h1 className="ptitle">{pg.title}</h1>
        <p className="pmeta">
          <span><Clock size={14} /> {readingMinutes(pg.content)} {T.minRead}</span>
          <span>{T.updated} {fmtDate(pg.updatedAt, T.locale)}</span>
          {!pg.published && <span className="tag">{T.draft}</span>}
          {alts.map((a) => (
            <Link key={a.id} href={`${base}/${a.section.slug}/${a.slug}`} hrefLang={a.section.lang} lang={a.section.lang}>
              <Languages size={14} /> {T.alsoIn} {T.langName[asWLang(a.section.lang)]}
            </Link>
          ))}
          {admin && <a href={`/admin/page/${pg.id}`}><Pencil size={14} /> {T.edit}</a>}
        </p>
        <Prose html={html} />
        <div className="pn">
          {prev ? <Link href={url(prev)}><ChevronLeft size={18} /><span><small>{T.prev}</small>{prev.title}</span></Link> : <i />}
          {next ? <Link href={url(next)} className="r"><span><small>{T.next}</small>{next.title}</span><ChevronRight size={18} /></Link> : <i />}
        </div>
      </article>
      {toc.length > 1 && (
        <aside className="toc">
          <b>{T.onPage}</b>
          {toc.map((t) => <a key={t.id} href={`#${t.id}`} style={{ paddingLeft: (t.level - 1) * 12 }}>{t.text}</a>)}
        </aside>
      )}
    </div>
  );
}
