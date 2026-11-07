import { cookies, headers } from "next/headers";
import it from "./it";
import en from "./en";

export type Lang = "it" | "en";
export const LANGS: Lang[] = ["it", "en"];
export const dictionaries = { it, en };
export const wikiUrl = process.env.NEXT_PUBLIC_WIKI_URL || "https://wiki.argh.space";

// Lingua scelta dall'utente (cookie) oppure, in mancanza, quella del browser (Accept-Language).
export async function getLang(): Promise<Lang> {
  const saved = (await cookies()).get("lang")?.value;
  if (saved === "it" || saved === "en") return saved;
  const accept = (await headers()).get("accept-language") ?? "";
  for (const part of accept.split(",")) {
    const code = part.trim().slice(0, 2).toLowerCase();
    if (code === "it") return "it";
    if (code === "en") return "en";
  }
  // lingua non supportata (es. fr): inglese; nessuna intestazione: italiano
  return accept ? "en" : "it";
}
export async function getContent() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] as typeof it };
}
