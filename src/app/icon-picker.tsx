"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Icon, sectionIcons } from "./icons";

/** Selettore compatto: un pulsante con l'icona attuale che apre una griglia di sole icone. */
export function IconPicker({ value }: { value: string }) {
  const [v, setV] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  const label = sectionIcons.find(([k]) => k === v)?.[1] ?? "Icona";
  return (
    <div className="ipick" ref={ref}>
      <input type="hidden" name="icon" value={v} />
      <button type="button" className="ipbtn" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open} title={`Icona: ${label}`}>
        <Icon name={v} size={20} /><ChevronDown size={14} />
      </button>
      {open && (
        <div className="ipop" role="listbox" aria-label="Scegli l'icona">
          {sectionIcons.map(([k, l]) => (
            <button key={k} type="button" role="option" aria-selected={k === v} title={l} aria-label={l}
              className={k === v ? "on" : ""} onClick={() => { setV(k); setOpen(false); }}>
              <Icon name={k} size={20} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
