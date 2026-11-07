"use client";
import { useRouter } from "next/navigation";

/** Testo della pagina: i link interni usano la navigazione client (senza ricaricare la wiki). */
export function Prose({ html }: { html: string }) {
  const router = useRouter();
  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: html }}
      onClick={(e) => {
        const a = (e.target as HTMLElement).closest("a");
        const href = a?.getAttribute("href");
        if (!a || !href || !href.startsWith("/") || href.startsWith("//") || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        router.push(href);
      }}
    />
  );
}
