import { Logo } from "../logo";
import { WikiNav } from "../wiki-nav";
import { LangSelect } from "../lang-select";
import { sectionsWithPages } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { wikiBase } from "@/lib/wikibase";
import { getLang } from "@/lib/i18n";
import { wikiText } from "@/lib/i18n/wiki";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Wiki A.R.G.H. · Documentazione del radiotelescopio", template: "%s · Wiki A.R.G.H." },
  description: "Guide tecniche, software e materiale didattico del progetto A.R.G.H.: parabola da 2,4 m, SDR e riga dell'idrogeno a 21 cm.",
};

export default async function WikiLayout({ children }: { children: React.ReactNode }) {
  const base = await wikiBase();
  const lang = await getLang();
  const T = wikiText[lang];
  const nav = (await sectionsWithPages()).map((s) => ({
    title: s.title, slug: s.slug, icon: s.icon, lang: s.lang,
    pages: s.pages.map((p) => ({ title: p.title, slug: p.slug })),
  })).filter((s) => s.pages.length);
  const admin = await isAdmin();
  // percorso -> { lingua: percorso della traduzione } (stessa "key"), per cambiare lingua restando sulla stessa pagina
  const all = await sectionsWithPages();
  const alts: Record<string, Record<string, string>> = {};
  const put = (from: string, lang: string, to: string) => { (alts[from] ??= {})[lang] = to; };
  for (const s of all) for (const t of all) {
    if (!s.key || s.key !== t.key || s.lang === t.lang) continue;
    put(`${base}/${s.slug}`, t.lang, `${base}/${t.slug}`);
    for (const p of s.pages) { const q = p.key ? t.pages.find((x) => x.key === p.key) : undefined; if (q) put(`${base}/${s.slug}/${p.slug}`, t.lang, `${base}/${t.slug}/${q.slug}`); }
  }
  const labels = Object.fromEntries((["it", "en"] as const).map((l) => [l, { search: wikiText[l].search, noResults: wikiText[l].noResults, menu: wikiText[l].menu }]));
  return (
    <>
      <header className="nav">
        <Link href={base || "/"} className="brand"><Logo size={34} /><span>A.R.G.H. <em>Wiki</em></span></Link>
        <nav className="anav">
          <a href={process.env.NEXT_PUBLIC_SITE_URL || "/"}>{T.home}</a>
          <LangSelect current={lang} label={T.language} alts={alts} home={base || "/"} />
          {admin && <a href="/admin" className="btn small">Admin</a>}
        </nav>
      </header>
      <div className="wiki">
        <WikiNav base={base} sections={nav} defaultLang={lang} labels={labels} />
        <main className="doc">{children}</main>
      </div>
      <footer className="foot">
        <span>© {new Date().getFullYear()} A.R.G.H. · Astronomical Radio Ground Hub</span>
        <span className="flinks"><a href="/privacy">Privacy</a><a href="/cookie">Cookie</a></span>
      </footer>
    </>
  );
}
