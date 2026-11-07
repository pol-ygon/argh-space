import { Logo } from "./logo";
import { LangSelect } from "./lang-select";
import { getContent } from "@/lib/i18n";

export async function LegalPage({ kind }: { kind: "privacy" | "cookies" }) {
  const { lang, t } = await getContent();
  const d = t.legal[kind];
  const cookies = kind === "cookies" ? t.legal.cookies : null;
  return (
    <>
      <header className="nav">
        <a href="/" className="brand"><Logo size={36} /><span>{t.site.name}</span></a>
        <nav><LangSelect current={lang} label={t.ui.langLabel} /></nav>
      </header>
      <main className="legal">
        <a href="/" className="meta">{t.legal.back}</a>
        <h1>{d.title}</h1>
        <p className="meta">{t.legal.updated}</p>
        <p>{d.intro}</p>
        {cookies && (
          <div className="tablewrap">
            <table>
              <thead><tr>{Object.values(cookies.tableHead).map((h) => <th key={h}>{h}</th>)}</tr></thead>
              <tbody>{cookies.list.map((c) => (
                <tr key={c.name}><td><code>{c.name}</code></td><td>{c.purpose}</td><td>{c.duration}</td><td>{c.type}</td></tr>
              ))}</tbody>
            </table>
          </div>
        )}
        {d.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((x) => <p key={x}>{x}</p>)}
            {s.ul.length > 0 && <ul>{s.ul.map((x) => <li key={x}>{x}</li>)}</ul>}
          </section>
        ))}
        <p className="meta">
          <a href="/privacy">{t.legal.footer.privacy}</a> · <a href="/cookie">{t.legal.footer.cookies}</a>
        </p>
      </main>
    </>
  );
}
