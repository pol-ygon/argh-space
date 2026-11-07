"use client";
import { useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

const hasCookie = () => document.cookie.split("; ").some((c) => c.startsWith("lang="));
const save = (l: string) => { document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`; };

type Props = {
  current: "it" | "en"; label: string;
  /** wiki: percorso -> { lingua: percorso della pagina tradotta } */
  alts?: Record<string, Record<string, string>>;
  /** wiki: dove andare se la pagina non ha traduzione */
  home?: string;
};

export function LangSelect({ current, label, alts, home }: Props) {
  const router = useRouter();
  const path = usePathname();
  const [pending, start] = useTransition();

  // Primo accesso: riconosce la lingua del browser (navigator.language) e la applica.
  useEffect(() => {
    if (hasCookie()) return;
    const l = (navigator.languages?.[0] || navigator.language || "it").slice(0, 2).toLowerCase();
    const detected = l === "it" ? "it" : "en";
    save(detected);
    if (detected !== current) start(() => router.refresh());
  }, [current, router]);

  return (
    <label className="lang" aria-label={label}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
        <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
      </svg>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => {
          const l = e.target.value;
          save(l); document.documentElement.lang = l;
          start(() => {
            if (alts) {
              // nella wiki: si passa alla stessa pagina nell'altra lingua; se manca, alla home della wiki
              const target = alts[path]?.[l] ?? (path === home ? undefined : home);
              if (target && target !== path) router.push(target);
            }
            router.refresh();
          });
        }}
      >
        <option value="it">IT · Italiano</option>
        <option value="en">EN · English</option>
      </select>
    </label>
  );
}
