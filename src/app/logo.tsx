// Versione compatta (solo il cerchio con la parabola) per navbar e wiki.
export function Logo({ size = 40 }: { size?: number }) {
  return <span className="mark" style={{ width: size, height: size }} role="img" aria-label="Logo A.R.G.H." />;
}
