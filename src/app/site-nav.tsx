"use client";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { LangSelect } from "./lang-select";

type Props = {
  links: { href: string; label: string }[];
  wiki: { href: string; label: string };
  lang: "it" | "en";
  langLabel: string;
};

export function SiteNav({ links, wiki, lang, langLabel }: Props) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => { document.body.classList.toggle("noscroll", open); return () => document.body.classList.remove("noscroll"); }, [open]);

  return (
    <>
      <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-menu" aria-label="Menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <nav id="site-menu" className={`menu ${open ? "open" : ""}`}>
        {links.map((l) => <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        <LangSelect current={lang} label={langLabel} />
        <a href={wiki.href} className="btn small">{wiki.label}</a>
      </nav>
    </>
  );
}
