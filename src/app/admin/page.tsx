import { redirect } from "next/navigation";
import { ChevronUp, ChevronDown, Settings, Eye, EyeOff, Pencil, ExternalLink, Plus, FolderPlus, FileText } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { sectionsWithPages } from "@/lib/db";
import { Icon } from "../icons";
import { IconPicker } from "../icon-picker";
import { ConfirmButton } from "../confirm-button";
import { fmtDate } from "@/lib/wikibase";
import { createSection, renameSection, deleteSection, createPage, moveSection, movePage, togglePublished } from "@/lib/actions";

export const dynamic = "force-dynamic";

function Move({ id, dir, action, disabled }: { id: number; dir: "up" | "down"; action: (f: FormData) => Promise<void>; disabled: boolean }) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} /><input type="hidden" name="dir" value={dir} />
      <button className="ibtn" disabled={disabled} title={dir === "up" ? "Sposta su" : "Sposta giù"} aria-label={dir === "up" ? "Sposta su" : "Sposta giù"}>
        {dir === "up" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
    </form>
  );
}

export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const list = await sectionsWithPages(false);
  const pages = list.flatMap((s) => s.pages);
  const published = pages.filter((p) => p.published).length;
  const stats = [
    { v: list.length, l: "Gruppi" }, { v: pages.length, l: "Pagine" },
    { v: published, l: "Pubblicate" }, { v: pages.length - published, l: "Bozze" },
  ];


  return (
    <div className="adm">
      <div className="ahead">
        <div><h1>Gestione wiki</h1><p className="meta">Crea gruppi e pagine, riordinali e decidi cosa pubblicare.</p></div>
      </div>

      <div className="astats">
        {stats.map((s) => <div key={s.l}><b>{s.v}</b><span>{s.l}</span></div>)}
      </div>

      <form action={createSection} className="apanel">
        <FolderPlus size={20} className="pi" />
        <input name="title" placeholder="Nome del nuovo gruppo (es. Hardware)…" required aria-label="Nome del gruppo" />
        <IconPicker value="book" />
        <select name="lang" defaultValue="it" aria-label="Lingua del gruppo"><option value="it">Italiano</option><option value="en">English</option></select>
        <button className="btn small"><Plus size={15} /> Crea gruppo</button>
      </form>

      {list.length === 0 && (
        <div className="aempty"><FileText size={34} /><h3>Ancora nessun contenuto</h3><p>Crea il primo gruppo qui sopra, poi aggiungi le pagine.</p></div>
      )}

      {list.map((s) => {
        const same = list.filter((x) => x.lang === s.lang);
        const first = same[0].id === s.id, last = same[same.length - 1].id === s.id;
        return (
        <section key={s.id} className="acard">
          <div className="ahd">
            <span className="ico sm"><Icon name={s.icon} size={20} /></span>
            <div className="at"><h2>{s.title} <span className="badge lang">{s.lang.toUpperCase()}</span></h2><span className="meta">{s.pages.length} {s.pages.length === 1 ? "pagina" : "pagine"} · /{s.slug}</span></div>
            <div className="acts">
              <Move id={s.id} dir="up" action={moveSection} disabled={first} />
              <Move id={s.id} dir="down" action={moveSection} disabled={last} />
              <details className="sett">
                <summary className="ibtn" title="Impostazioni del gruppo" aria-label="Impostazioni del gruppo"><Settings size={16} /></summary>
                <form action={renameSection} className="spanel">
                  <input type="hidden" name="id" value={s.id} />
                  <label>Nome<input name="title" defaultValue={s.title} required /></label>
                  <div className="irow"><span>Icona</span><IconPicker value={s.icon} /></div>
                  <label>Lingua<select name="lang" defaultValue={s.lang}><option value="it">Italiano</option><option value="en">English</option></select></label>
                  <label>Collegamento traduzione<input name="key" defaultValue={s.key ?? ""} placeholder="es. srt-hardware" /></label>
                  <div className="row">
                    <ConfirmButton className="btn danger small" formAction={deleteSection}
                      message={`Eliminare il gruppo "${s.title}" e le sue ${s.pages.length} pagine? L'operazione non si può annullare.`}>Elimina gruppo</ConfirmButton>
                    <button className="btn small">Salva</button>
                  </div>
                </form>
              </details>
            </div>
          </div>

          <div className="arows">
            {s.pages.length === 0 && <p className="meta apad">Nessuna pagina in questo gruppo.</p>}
            {s.pages.map((p, pi) => (
              <div key={p.id} className="arow">
                <FileText size={17} className="fi" />
                <a href={`/admin/page/${p.id}`} className="pt">
                  <b>{p.title}</b><span>/{p.slug} · aggiornata il {fmtDate(p.updatedAt)}</span>
                </a>
                <span className={`badge ${p.published ? "ok" : "draft"}`}>{p.published ? "Pubblicata" : "Bozza"}</span>
                <div className="acts">
                  <Move id={p.id} dir="up" action={movePage} disabled={pi === 0} />
                  <Move id={p.id} dir="down" action={movePage} disabled={pi === s.pages.length - 1} />
                  <form action={togglePublished}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="ibtn" title={p.published ? "Passa a bozza" : "Pubblica"} aria-label={p.published ? "Passa a bozza" : "Pubblica"}>
                      {p.published ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </form>
                  <a className="ibtn" href={`/wiki/${s.slug}/${p.slug}`} target="_blank" rel="noreferrer" title="Apri nella wiki" aria-label="Apri nella wiki"><ExternalLink size={16} /></a>
                  <a className="ibtn pri" href={`/admin/page/${p.id}`} title="Modifica" aria-label="Modifica"><Pencil size={16} /></a>
                </div>
              </div>
            ))}
          </div>

          <form action={createPage} className="anew">
            <input type="hidden" name="section_id" value={s.id} />
            <Plus size={17} className="pi" />
            <input name="title" placeholder="Nuova pagina in questo gruppo…" required aria-label="Titolo della nuova pagina" />
            <button className="btn ghost small">Aggiungi pagina</button>
          </form>
        </section>
        );
      })}
    </div>
  );
}
