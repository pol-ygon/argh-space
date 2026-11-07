import { Logo } from "./logo";
import { Icon } from "./icons";
import { Reveal } from "./reveal";
import { HiChart } from "./hichart";
import { SiteNav } from "./site-nav";
import { JsonLd } from "./jsonld";
import { siteUrl, wikiOrigin } from "@/lib/seo";
import { getContent, wikiUrl } from "@/lib/i18n";

function Head({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <Reveal className="head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {sub && <p className="sub">{sub}</p>}
    </Reveal>
  );
}

export default async function Home() {
  const { lang, t: c } = await getContent();
  const site = c.site;
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization", "@id": `${siteUrl}/#org`, name: site.name, alternateName: site.full, url: siteUrl,
        logo: `${siteUrl}/logo.png`, email: site.email, description: site.description,
        address: { "@type": "PostalAddress", addressLocality: site.place, addressRegion: "Emilia-Romagna", addressCountry: "IT" },
        founder: { "@type": "Person", name: site.manager },
        areaServed: "Emilia-Romagna",
        knowsAbout: ["Radioastronomia", "Software Defined Radio", "STEM", "Open source"],
      },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: `${site.name} ${site.full}`, inLanguage: lang, publisher: { "@id": `${siteUrl}/#org` } },
      { "@type": "WebSite", url: wikiOrigin, name: `Wiki ${site.name}`, publisher: { "@id": `${siteUrl}/#org` } },
    ],
  };
  return (
    <>
      <JsonLd data={ld} />
      <header className="nav">
        <a href="#top" className="brand"><Logo size={36} /><span>{site.name}</span></a>
        <SiteNav
          lang={lang}
          langLabel={c.ui.langLabel}
          wiki={{ href: wikiUrl, label: c.ui.nav.wiki }}
          links={[
            { href: "/", label: c.ui.nav.home },
            { href: "#progetto", label: c.ui.nav.project },
            { href: "#sistema", label: c.ui.nav.system },
            { href: "#piano", label: c.ui.nav.plan },
            { href: "#open", label: c.ui.nav.open },
            { href: "#contatti", label: c.ui.nav.contacts },
          ]}
        />
      </header>

      <main id="top">
        <section className="hero">
          <div className="stars" aria-hidden />
          <div className="glow" aria-hidden />
          <div className="hero-grid">
            <div className="hero-text">
              <p className="eyebrow">{site.full}</p>
              <h1>{c.site.tagline}</h1>
              <p className="lead">{site.description}</p>
              <div className="cta">
                <a href={wikiUrl} className="btn">{c.ui.ctaWiki}</a>
                <a href="#progetto" className="btn ghost">{c.ui.ctaProject}</a>
              </div>
            </div>
            <HiChart labels={c.chart} />
          </div>
          <a href="#progetto" className="scroll" aria-label="Scorri">↓</a>
        </section>

        <section className="supporters">
          <Reveal>
            <a href={c.supporters.url} target="_blank" rel="noopener noreferrer" className="sup">
              <img src="/ari-logo.png" alt={c.supporters.alt} width={36} height={52} />
              <span><small>{c.supporters.label}</small><b>{c.supporters.name}</b><em>{c.supporters.desc}</em></span>
            </a>
          </Reveal>
        </section>

        <section className="statbar">
          {c.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="stat"><b>{s.value}</b><span>{s.label}</span></Reveal>
          ))}
        </section>

        <section className="wrap">
          <Head eyebrow={c.whyRadio.eyebrow} title={c.whyRadio.title} sub={c.whyRadio.sub} />
          <div className="two even">
            <Reveal><article className="card"><div className="chead"><div className="ico"><Icon name="eye" /></div><h3>{c.whyRadio.optical.title}</h3></div><p>{c.whyRadio.optical.text}</p></article></Reveal>
            <Reveal delay={100}><article className="card glowcard"><div className="chead"><div className="ico"><Icon name="radio" /></div><h3>{c.whyRadio.radio.title}</h3></div><p>{c.whyRadio.radio.text}</p></article></Reveal>
          </div>
          <div className="grid3" style={{ marginTop: 40 }}>
            {c.pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 100}><article className="pillar"><h3>{p.title}</h3><p>{p.text}</p></article></Reveal>
            ))}
          </div>
        </section>

        <section id="progetto" className="wrap">
          <Head eyebrow={c.about.eyebrow} title={c.about.title} />
          <div className="two">
            <Reveal>{c.about.text.map((t) => <p key={t} className="body">{t}</p>)}</Reveal>
            <Reveal delay={120}>
              <div className="quote">
                <span>{c.about.inspired}</span>
                <strong>{c.about.inspiredName}</strong>
                <p>{c.about.note}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="wrap">
          <Head {...c.goalsHead} />
          <div className="grid3">
            {c.goals.map((g, i) => (
              <Reveal key={g.title} delay={i * 100}>
                <article className="card tall">
                  <div className="chead"><div className="ico"><Icon name={g.icon} /></div><h3>{g.title}</h3></div>
                  <ul>{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="sistema" className="wrap">
          <Head {...c.systemHead} />
          <div className="chain">
            {c.system.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <article className="node"><span className="num">{s.n}</span><h3>{s.title}</h3><p>{s.text}</p></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="wrap">
          <Head {...c.scienceHead} />
          <div className="grid2">
            {c.science.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <article className="card"><div className="chead"><div className="ico"><Icon name={s.icon} /></div><h3>{s.title}</h3></div><p>{s.text}</p></article>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="wrap">
          <Head {...c.hiHead} />
          <div className="two even">
            <Reveal>
              <figure className="chart">
                <svg viewBox="0 0 400 220" role="img" aria-label={c.hi.aria}>
                  <defs><linearGradient id="hg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#29b6f6" stopOpacity=".5"/><stop offset="1" stopColor="#29b6f6" stopOpacity="0"/></linearGradient></defs>
                  <g stroke="#1c2547" fill="none"><path d="M40 20V180H380"/>{[0,1,2,3,4].map(i=><path key={i} d={`M${40+i*85} 180v5`}/>)}</g>
                  <path d="M40 175 C80 172 100 170 120 160 S150 120 175 120 S200 40 225 38 S250 110 265 112 S290 150 310 158 S350 172 380 174 V180 H40Z" fill="url(#hg)"/>
                  <path d="M40 175 C80 172 100 170 120 160 S150 120 175 120 S200 40 225 38 S250 110 265 112 S290 150 310 158 S350 172 380 174" fill="none" stroke="#29b6f6" strokeWidth="2.5"/>
                  <g fill="#9aa7c7" fontSize="11" textAnchor="middle">{["-100","-50","0","+50","+100"].map((t,i)=><text key={t} x={40+i*85} y="200">{t}</text>)}<text x="210" y="216">{c.chart.axisX}</text></g>
                  <text x="232" y="32" fill="#fff" fontSize="11">{c.hi.peak}</text>
                </svg>
                <figcaption>{c.hi.caption}</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={100}>
              <ol className="expl">{c.hi.items.map((h, i) => <li key={h.title}><span>{i + 1}</span><div><b>{h.title}</b><p>{h.text}</p></div></li>)}</ol>
            </Reveal>
          </div>
        </section>

        <section id="piano" className="wrap">
          <Head {...c.planHead} />
          <ol className="timeline">
            {c.phases.map((p, i) => (
              <Reveal key={p.phase} delay={i * 100}>
                <li>
                  <div className="when"><b>{p.phase}</b><span>{p.months}</span></div>
                  <div className="what"><h3>{p.title}</h3><p>{p.text}</p></div>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <section className="wrap">
          <Head {...c.impactHead} />
          <div className="grid3">
            {c.impact.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}><article className="card"><h3>{s.title}</h3><p>{s.text}</p></article></Reveal>
            ))}
          </div>
        </section>

        <section id="open" className="wrap">
          <Head {...c.openHead} />
          <div className="grid2">
            {c.openness.map((o, i) => (
              <Reveal key={o} delay={i * 80}><article className="card"><p style={{ color: "var(--fg)" }}>{o}</p></article></Reveal>
            ))}
          </div>
        </section>

        <section className="wrap">
          <Head eyebrow={c.support.eyebrow} title={c.support.title} />
          <Reveal>
            <div className="support">
              <p>
                {c.support.before}<strong>{c.support.name}</strong>{c.support.after}
              </p>
              <p className="meta">{c.support.managerLabel} <strong>{site.manager}</strong>, {site.callsign} · {site.place}</p>
            </div>
          </Reveal>
          <div className="credits">
            {c.credits.map((x) => <div key={x.name}><b>{x.name}</b><span>{x.note}</span></div>)}
          </div>
        </section>

        <section id="contatti" className="wrap">
          <Head {...c.asksHead} />
          <div className="grid3">
            {c.asks.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}><article className="card"><div className="chead"><div className="ico"><Icon name={a.icon} /></div><h3>{a.title}</h3></div><p>{a.text}</p></article></Reveal>
            ))}
          </div>
          <Reveal><p className="contact">{c.contact}<a href={`mailto:${site.email}`}>{site.email}</a></p></Reveal>
        </section>

        <section className="wrap">
          <Reveal>
            <div className="banner">
              <h2>{c.banner.title}</h2>
              <p>{c.banner.text}</p>
              <a href={wikiUrl} className="btn">{c.banner.cta}</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="foot">
        <span>© {new Date().getFullYear()} {site.name} · {site.full} · {site.place} · <a href={`mailto:${site.email}`}>{site.email}</a></span>
        <span className="flinks"><a href="/privacy">{c.legal.footer.privacy}</a><a href="/cookie">{c.legal.footer.cookies}</a><a href="/admin">{c.ui.admin}</a></span>
      </footer>
    </>
  );
}
