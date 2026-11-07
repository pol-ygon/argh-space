"use client";
import { useEffect, useRef } from "react";

// Spettro HI animato (illustrativo): picchi che derivano in modo casuale + rumore.
export function HiChart({ labels }: { labels: { aria: string; caption: string; axisX: string; axisY: string } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const N = 220, rnd = (a: number, b: number) => a + Math.random() * (b - a);
    // componenti gaussiane con parametri che vagano casualmente
    const peaks = [
      { a: 1, c: 0.0, w: 0.07, fa: rnd(.3, .6), fc: rnd(.2, .4), pa: rnd(0, 6), pc: rnd(0, 6) },
      { a: .55, c: -0.38, w: 0.09, fa: rnd(.3, .7), fc: rnd(.2, .5), pa: rnd(0, 6), pc: rnd(0, 6) },
      { a: .4, c: 0.34, w: 0.08, fa: rnd(.3, .7), fc: rnd(.2, .5), pa: rnd(0, 6), pc: rnd(0, 6) },
      { a: .25, c: 0.62, w: 0.1, fa: rnd(.3, .7), fc: rnd(.2, .5), pa: rnd(0, 6), pc: rnd(0, 6) },
    ];
    const avg = new Float32Array(N); let raf = 0, w = 0, h = 0;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1, r = cv.getBoundingClientRect();
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener("resize", resize);

    const frame = (ms: number) => {
      const t = ms / 1000;
      ctx.clearRect(0, 0, w, h);
      const L = 46, R = 28, T = 14, B = 34, pw = w - L - R, ph = h - T - B;
      ctx.strokeStyle = "rgba(154,167,199,.14)"; ctx.fillStyle = "#9aa7c7"; ctx.lineWidth = 1; ctx.font = "11px system-ui";
      ctx.textAlign = "center";
      ["-100", "-50", "0", "+50", "+100"].forEach((lab, i) => {
        const x = L + (pw * i) / 4; ctx.beginPath(); ctx.moveTo(x, T); ctx.lineTo(x, T + ph); ctx.stroke(); ctx.fillText(lab, x, h - 16);
      });
      for (let i = 0; i <= 3; i++) { const y = T + (ph * i) / 3; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(L + pw, y); ctx.stroke(); }
      ctx.fillText(labels.axisX, L + pw / 2, h - 2);
      ctx.save(); ctx.translate(12, T + ph / 2); ctx.rotate(-Math.PI / 2); ctx.fillText(labels.axisY, 0, 0); ctx.restore();

      const ys: number[] = [];
      for (let i = 0; i < N; i++) {
        const x = (i / (N - 1)) * 2 - 1; let v = 0.04;
        for (const p of peaks) {
          const amp = p.a * (0.75 + 0.25 * Math.sin(t * p.fa + p.pa));
          const cen = p.c + 0.05 * Math.sin(t * p.fc + p.pc);
          v += amp * Math.exp(-((x - cen) ** 2) / (2 * p.w * p.w));
        }
        v += (Math.random() - 0.5) * 0.12;            // rumore istantaneo
        avg[i] += (v - avg[i]) * 0.18;                // integrazione: scia morbida
        ys.push(T + ph - Math.max(0, Math.min(1.1, avg[i])) * ph * 0.88);
      }
      const path = () => { ctx.beginPath(); ys.forEach((y, i) => { const x = L + (i / (N - 1)) * pw; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); };
      path(); ctx.lineTo(L + pw, T + ph); ctx.lineTo(L, T + ph); ctx.closePath();
      const g = ctx.createLinearGradient(0, T, 0, T + ph); g.addColorStop(0, "rgba(41,182,246,.45)"); g.addColorStop(1, "rgba(139,108,255,0)");
      ctx.fillStyle = g; ctx.fill();
      path(); ctx.strokeStyle = "#29b6f6"; ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.shadowColor = "#29b6f6"; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [labels.axisX, labels.axisY]);

  return (
    <figure className="hero-chart">
      <canvas ref={ref} role="img" aria-label={labels.aria} />
      <figcaption>{labels.caption}</figcaption>
    </figure>
  );
}
