import { ExternalLink, LogOut } from "lucide-react";
import { Logo } from "../logo";
import { isAdmin } from "@/lib/auth";
import { logout } from "@/lib/actions";

import type { Metadata } from "next";

export const metadata: Metadata = { title: "Gestione", robots: { index: false, follow: false, nocache: true } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  return (
    <>
      <header className="nav">
        <a href="/admin" className="brand"><Logo size={34} /><span>A.R.G.H. <em>Gestione</em></span></a>
        <nav className="anav">
          <a href="/wiki"><ExternalLink size={15} /> Vedi la wiki</a>
          <a href="/">Sito</a>
          {admin && <form action={logout}><button className="btn ghost small"><LogOut size={14} /> Esci</button></form>}
        </nav>
      </header>
      {children}
    </>
  );
}
