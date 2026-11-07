"use client";
import { useActionState } from "react";
import { login } from "@/lib/actions";
import { Logo } from "../../logo";

export default function Login() {
  const [err, action, pending] = useActionState(login, null);
  return (
    <form action={action} className="login">
      <div style={{ textAlign: "center" }}><Logo size={80} /></div>
      <h2 style={{ textAlign: "center" }}>Accesso admin</h2>
      <input name="user" placeholder="Utente" autoComplete="username" required />
      <input name="pass" type="password" placeholder="Password" autoComplete="current-password" required />
      {err && <div className="err">{err}</div>}
      <button className="btn" disabled={pending}>{pending ? "Accesso…" : "Entra"}</button>
    </form>
  );
}
