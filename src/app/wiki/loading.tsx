// Scheletro mostrato subito durante la navigazione tra pagine: indice e intestazione restano fermi.
export default function Loading() {
  return (
    <div className="skel" aria-busy="true" aria-label="Caricamento">
      <i style={{ width: "30%" }} /><i className="t" style={{ width: "70%" }} />
      <i style={{ width: "100%" }} /><i style={{ width: "95%" }} /><i style={{ width: "85%" }} />
      <i className="t" style={{ width: "40%", marginTop: 28 }} />
      <i style={{ width: "100%" }} /><i style={{ width: "90%" }} />
    </div>
  );
}
