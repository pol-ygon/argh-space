import { headers } from "next/headers";
// Su wiki.argh.space i percorsi sono diretti (/sezione/pagina), altrove sotto /wiki.
export async function wikiBase() {
  const host = (await headers()).get("host") ?? "";
  return host.startsWith("wiki.") ? "" : "/wiki";
}
export const fmtDate = (d: Date, locale = "it-IT") =>
  d.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
