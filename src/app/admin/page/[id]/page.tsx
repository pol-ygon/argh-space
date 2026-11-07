import { notFound, redirect } from "next/navigation";
import { ExternalLink, Save, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { pageById } from "@/lib/db";
import { savePage, deletePage } from "@/lib/actions";
import { RichEditor } from "../../../rich-editor";
import { ConfirmButton } from "../../../confirm-button";
import { clean, toHtml } from "@/lib/content";
import { fmtDate } from "@/lib/wikibase";

export const dynamic = "force-dynamic";

export default async function EditPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; err?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const pg = await pageById(Number((await params).id));
  if (!pg) notFound();
  const q = await searchParams;
  const s = pg.section;
  return (
    <div className="adm wide">
      <nav className="crumbs"><a href="/admin">Gestione</a><span>/</span><span>{s.title}</span><span>/</span><b>{pg.title}</b></nav>
      {q.saved && <p className="flash ok"><CheckCircle2 size={17} /> Modifiche salvate.</p>}
      {q.err && <p className="flash err"><AlertTriangle size={17} /> L'indirizzo scelto è già usato da un'altra pagina di questo gruppo.</p>}

      <form action={savePage} className="egrid">
        <input type="hidden" name="id" value={pg.id} />
        <input type="hidden" name="position" value={pg.position} />
        <div className="emain">
          <input name="title" className="etitle" defaultValue={pg.title} placeholder="Titolo della pagina" required aria-label="Titolo" />
          <RichEditor name="content" initial={clean(toHtml(pg.content))} />
        </div>

        <aside className="eside">
          <div className="ebox">
            <h4>Stato</h4>
            <label className="switch">
              <input type="checkbox" name="published" defaultChecked={pg.published} />
              <i /><span>Pubblicata</span>
            </label>
            <p className="meta">Se disattivata, la pagina resta una bozza visibile solo a te.</p>
          </div>
          <div className="ebox">
            <h4>Indirizzo</h4>
            <label className="slugf"><span>/{s.slug}/</span><input name="slug" defaultValue={pg.slug} aria-label="Indirizzo della pagina" /></label>
            <label className="keyf"><span>Collegamento traduzione</span><input name="key" defaultValue={pg.key ?? ""} placeholder="es. dish-mounting" /></label>
            <p className="meta">Ultimo aggiornamento: {fmtDate(pg.updatedAt)}</p>
          </div>
          <div className="ebox actions">
            <button className="btn"><Save size={16} /> Salva modifiche</button>
            <a className="btn ghost" href={`/wiki/${s.slug}/${pg.slug}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Apri nella wiki</a>
            <ConfirmButton className="btn danger" formAction={deletePage} message={`Eliminare la pagina "${pg.title}"? L'operazione non si può annullare.`}>
              <Trash2 size={15} /> Elimina pagina
            </ConfirmButton>
          </div>
        </aside>
      </form>
    </div>
  );
}
