"use client";
import type { ButtonHTMLAttributes } from "react";

/** Pulsante che chiede conferma prima di inviare il form (es. eliminazioni). */
export function ConfirmButton({ message, ...props }: { message: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} onClick={(e) => { if (!window.confirm(message)) e.preventDefault(); }} />;
}
