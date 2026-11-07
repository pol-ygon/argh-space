import sanitize from "sanitize-html";
import { marked } from "marked";

// Il contenuto della wiki è HTML (editor rich text). Le pagine in Markdown create prima vengono convertite al volo.
export const toHtml = (c: string) => (/^\s*</.test(c) || !c.trim() ? c : (marked.parse(c, { async: false }) as string));

export const clean = (html: string) =>
  sanitize(html, {
    allowedTags: ["h1","h2","h3","h4","p","br","hr","strong","b","em","i","u","s","mark","code","pre","blockquote",
      "ul","ol","li","a","img","table","thead","tbody","tr","th","td","colgroup","col","span","div"],
    allowedAttributes: {
      a: ["href", "target", "rel"], img: ["src", "alt", "title"], th: ["colspan", "rowspan", "style"], td: ["colspan", "rowspan", "style"],
      p: ["style"], h1: ["style"], h2: ["style"], h3: ["style"], h4: ["style"], code: ["class"], pre: ["class"],
    },
    allowedStyles: { "*": { "text-align": [/^(left|right|center|justify)$/] } },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    transformTags: { a: (_t, a) => ({ tagName: "a", attribs: { ...a, rel: "noopener noreferrer" } }) },
  });

const text = (h: string) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "sezione";

export type TocItem = { id: string; text: string; level: number };

/** HTML sicuro + id sui titoli + indice dei contenuti. */
export function render(content: string) {
  const toc: TocItem[] = []; const used = new Set<string>();
  const html = clean(toHtml(content)).replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/g, (_m, lv, attrs, inner) => {
    const t = text(inner); let id = slug(t), n = 2; while (used.has(id)) id = `${slug(t)}-${n++}`; used.add(id);
    toc.push({ id, text: t, level: Number(lv) });
    return `<h${lv}${attrs} id="${id}">${inner}</h${lv}>`;
  });
  return { html, toc };
}
export const plain = (content: string) => text(clean(toHtml(content)));
export const readingMinutes = (content: string) => Math.max(1, Math.round(plain(content).split(" ").length / 200));
export const excerpt = (content: string, n = 130) => { const t = plain(content); return t.length > n ? t.slice(0, n).trimEnd() + "…" : t; };
