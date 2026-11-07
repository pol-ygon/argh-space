import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { sectionsWithPages, recentPages } from "@/lib/db";
import { wikiBase, fmtDate } from "@/lib/wikibase";
import { wikiOrigin } from "@/lib/seo";
import { getLang } from "@/lib/i18n";
import { wikiText, asWLang } from "@/lib/i18n/wiki";
import { Icon } from "../icons";

export const metadata: Metadata = { alternates: { canonical: wikiOrigin }, openGraph: { type: "website", url: wikiOrigin, siteName: "A.R.G.H. Wiki", title: "Wiki A.R.G.H." } };

export default async function WikiHome() {
  const base = await wikiBase();
  const lang = await getLang();
  const all = (await sectionsWithPages()).filter((s) => s.pages.length);
  let list = all.filter((s) => s.lang === lang);
  let shown = lang;
  if (!list.length && all.length) { shown = lang === "it" ? "en" : "it"; list = all.filter((s) => s.lang === shown); }
  const T = wikiText[lang], S = wikiText[asWLang(shown)];
  const recent = (await recentPages(20)).filter((p) => p.section.lang === shown).slice(0, 5);
  return (
    <>
      <section className="whero">
        <p className="eyebrow">{T.heroEyebrow}</p>
        <h1>{T.heroTitle}</h1>
        <p>{T.heroText}</p>
      </section>

      {list.length === 0 && <p className="meta">{T.empty}</p>}
      {shown !== lang && list.length > 0 && <p className="flash ok">{T.fallback}</p>}
      <div className="sgrid">
        {list.map((s) => (
          <Link key={s.id} href={`${base}/${s.slug}`} className="card scard">
            <div className="chead"><div className="ico"><Icon name={s.icon} /></div><h3>{s.title}</h3></div>
            <ul>{s.pages.slice(0, 3).map((p) => <li key={p.id}>{p.title}</li>)}</ul>
            <span className="count">{s.pages.length} {s.pages.length === 1 ? S.page : S.pages} →</span>
          </Link>
        ))}
      </div>

      {recent.length > 0 && (
        <>
          <h2 className="rec-h"><Clock size={18} /> {S.recent}</h2>
          <div className="recent">
            {recent.map((p) => (
              <Link key={p.id} href={`${base}/${p.section.slug}/${p.slug}`}>
                <b>{p.title}</b><span>{p.section.title} · {fmtDate(p.updatedAt, S.locale)}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
