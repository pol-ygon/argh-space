"use client";
import { useEffect, useState } from "react";
import { Icon } from "./icons";

type Props = { text: string; more: string; ok: string; aria: string };
const KEY = "cookie_notice";

export function CookieBanner({ text, more, ok, aria }: Props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(!document.cookie.split("; ").some((c) => c.startsWith(KEY + "=")));
  }, []);
  if (!show) return null;
  const close = () => {
    document.cookie = `${KEY}=1; path=/; max-age=31536000; samesite=lax`;
    setShow(false);
  };
  return (
    <div className="cookie" role="dialog" aria-live="polite" aria-label={aria}>
      <span className="cookie-ico"><Icon name="cookie" size={22} /></span>
      <p>{text} <a href="/cookie">{more}</a></p>
      <button className="btn small" onClick={close}>{ok}</button>
    </div>
  );
}
