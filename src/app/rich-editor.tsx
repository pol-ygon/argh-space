"use client";
import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Bold, Italic, Underline, Strikethrough, Highlighter, Code, List, ListOrdered, Quote, SquareCode, Minus, Link2, Link2Off,
  ImagePlus, Table2, AlignLeft, AlignCenter, AlignRight, Undo2, Redo2, Rows3, Columns3, Trash2, type LucideIcon } from "lucide-react";

function B({ icon: I, title, on, active, disabled }: { icon: LucideIcon; title: string; on: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" title={title} aria-label={title} aria-pressed={active} disabled={disabled}
      className={`tb ${active ? "on" : ""}`} onMouseDown={(e) => e.preventDefault()} onClick={on}><I size={17} /></button>
  );
}

export function RichEditor({ name, initial }: { name: string; initial: string }) {
  const [html, setHtml] = useState(initial);
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({ link: { openOnClick: false, autolink: true } }),
      Image, Highlight, Placeholder.configure({ placeholder: "Scrivi qui il contenuto della pagina…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: false }), TableRow, TableHeader, TableCell,
    ],
    content: initial,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: { attributes: { class: "prose editor-area" } },
  });
  if (!editor) return <div className="editor"><div className="editor-area prose">…</div></div>;
  const c = () => editor.chain().focus();
  const block = editor.isActive("heading", { level: 1 }) ? "1" : editor.isActive("heading", { level: 2 }) ? "2" : editor.isActive("heading", { level: 3 }) ? "3" : "0";
  const setBlock = (v: string) => (v === "0" ? c().setParagraph().run() : c().setHeading({ level: Number(v) as 1 | 2 | 3 }).run());
  const link = () => {
    const prev = editor.getAttributes("link").href ?? "https://";
    const url = window.prompt("Indirizzo del link (http, https o mailto):", prev);
    if (url === null) return;
    url === "" ? c().unsetLink().run() : c().extendMarkRange("link").setLink({ href: url }).run();
  };
  const image = () => { const u = window.prompt("Indirizzo (URL) dell'immagine:", "https://"); if (u && u !== "https://") c().setImage({ src: u }).run(); };
  const inTable = editor.isActive("table");

  return (
    <div className="editor">
      <input type="hidden" name={name} value={html} />
      <div className="toolbar" role="toolbar" aria-label="Formattazione">
        <select className="tsel" value={block} onChange={(e) => setBlock(e.target.value)} aria-label="Stile del paragrafo">
          <option value="0">Testo</option><option value="1">Titolo 1</option><option value="2">Titolo 2</option><option value="3">Titolo 3</option>
        </select>
        <span className="sep" />
        <B icon={Bold} title="Grassetto" on={() => c().toggleBold().run()} active={editor.isActive("bold")} />
        <B icon={Italic} title="Corsivo" on={() => c().toggleItalic().run()} active={editor.isActive("italic")} />
        <B icon={Underline} title="Sottolineato" on={() => c().toggleUnderline().run()} active={editor.isActive("underline")} />
        <B icon={Strikethrough} title="Barrato" on={() => c().toggleStrike().run()} active={editor.isActive("strike")} />
        <B icon={Highlighter} title="Evidenzia" on={() => c().toggleHighlight().run()} active={editor.isActive("highlight")} />
        <B icon={Code} title="Codice in linea" on={() => c().toggleCode().run()} active={editor.isActive("code")} />
        <span className="sep" />
        <B icon={List} title="Elenco puntato" on={() => c().toggleBulletList().run()} active={editor.isActive("bulletList")} />
        <B icon={ListOrdered} title="Elenco numerato" on={() => c().toggleOrderedList().run()} active={editor.isActive("orderedList")} />
        <B icon={Quote} title="Citazione" on={() => c().toggleBlockquote().run()} active={editor.isActive("blockquote")} />
        <B icon={SquareCode} title="Blocco di codice" on={() => c().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} />
        <B icon={Minus} title="Linea separatrice" on={() => c().setHorizontalRule().run()} />
        <span className="sep" />
        <B icon={AlignLeft} title="Allinea a sinistra" on={() => c().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} />
        <B icon={AlignCenter} title="Centra" on={() => c().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} />
        <B icon={AlignRight} title="Allinea a destra" on={() => c().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} />
        <span className="sep" />
        <B icon={Link2} title="Inserisci link" on={link} active={editor.isActive("link")} />
        <B icon={Link2Off} title="Rimuovi link" on={() => c().unsetLink().run()} disabled={!editor.isActive("link")} />
        <B icon={ImagePlus} title="Immagine da URL" on={image} />
        <B icon={Table2} title="Inserisci tabella" on={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
        {inTable && <>
          <B icon={Rows3} title="Aggiungi riga" on={() => c().addRowAfter().run()} />
          <B icon={Columns3} title="Aggiungi colonna" on={() => c().addColumnAfter().run()} />
          <B icon={Trash2} title="Elimina tabella" on={() => c().deleteTable().run()} />
        </>}
        <span className="sep" />
        <B icon={Undo2} title="Annulla" on={() => c().undo().run()} disabled={!editor.can().undo()} />
        <B icon={Redo2} title="Ripeti" on={() => c().redo().run()} disabled={!editor.can().redo()} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
