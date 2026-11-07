import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";

export const alt = "A.R.G.H. – Astronomical Radio Ground Hub";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await fs.readFile(path.join(process.cwd(), "public", "logo.png"));
  const src = `data:image/png;base64,${logo.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", alignItems: "center", padding: "0 90px", color: "#fff",
        background: "linear-gradient(135deg,#050816 0%,#0d1840 60%,#2a1f6b 100%)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={420} height={420} alt="" style={{ marginRight: 56 }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: 4 }}>A.R.G.H.</div>
          <div style={{ fontSize: 38, color: "#29b6f6", marginTop: 6 }}>Astronomical Radio Ground Hub</div>
          <div style={{ fontSize: 30, color: "#9aa7c7", marginTop: 28 }}>Radioastronomia per le scuole · Reggio Emilia</div>
        </div>
      </div>
    ),
    size,
  );
}
