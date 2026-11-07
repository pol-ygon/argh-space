// Inserisce gruppi e pagine di esempio (solo se la wiki è vuota). Uso: npm run seed
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.local" });
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL non impostata");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

type P = [title: string, slug: string, html: string];
const data: [title: string, slug: string, icon: string, pages: P[]][] = [
  ["Per iniziare", "per-iniziare", "rocket", [
    ["Benvenuti in A.R.G.H.", "benvenuti", `<p><strong>A.R.G.H.</strong> (<em>Astronomical Radio Ground Hub</em>) è una piattaforma educativa e scientifica per la radioastronomia, costruita attorno a una parabola da <mark>2,4 metri</mark> e a ricevitori SDR a basso costo.</p>
<h2>Cosa trovi in questa wiki</h2><ul><li>Le <strong>guide tecniche</strong> per costruire e configurare il radiotelescopio</li><li>Il <strong>software</strong> e gli esempi di analisi dei dati</li><li>Il materiale <strong>didattico</strong> per scuole e insegnanti</li></ul>
<blockquote><p>L'idea centrale: non solo guardare il cielo, ma imparare a misurarlo.</p></blockquote>
<h2>Il progetto in numeri</h2>
<table><tbody><tr><th>Parametro</th><th>Valore</th></tr><tr><td>Diametro della parabola</td><td>2,4 m</td></tr><tr><td>Frequenza della riga HI</td><td>1420,4058 MHz</td></tr><tr><td>Banda di acquisizione</td><td>1,3–1,7 GHz</td></tr><tr><td>Durata del progetto</td><td>12 mesi</td></tr></tbody></table>
<p>Il progetto si ispira al <a href="https://www.haystack.mit.edu">Small Radio Telescope del MIT Haystack Observatory</a>.</p>`],
    ["Come contribuire", "come-contribuire", `<h2>Tanti modi per partecipare</h2><p>A.R.G.H. è un progetto aperto: ogni competenza è benvenuta.</p>
<h3>Competenze tecniche</h3><ol><li>Elettronica RF e antenne</li><li>Programmazione in <code>Python</code> e GNU Radio</li><li>Meccanica e installazione</li></ol>
<h3>Scuole e divulgazione</h3><ul><li>Laboratori in classe</li><li>Serate di osservazione pubblica</li></ul>
<hr><p>Per proporti scrivi a <a href="mailto:info@argh.space">info@argh.space</a>.</p>`],
  ]],
  ["Hardware", "hardware", "cpu", [
    ["La parabola da 2,4 m", "parabola", `<h2>Caratteristiche</h2><ul><li>Antenna parabolica a <strong>primo fuoco</strong> da 2,4 m</li><li>Banda operativa 1–2 GHz, ottimizzata per 1,42 GHz</li><li>Guadagno stimato di circa <strong>30 dBi</strong></li><li>Montatura equatoriale su palo con basamento</li></ul>
<h2>Parabola da 180 cm o da 240 cm?</h2>
<table><tbody><tr><th></th><th>180 cm</th><th>240 cm</th></tr><tr><td>Beam a 1,42 GHz</td><td>circa 8°</td><td>5–6°</td></tr><tr><td>Guadagno</td><td>26–28 dBi</td><td>30–31 dBi</td></tr></tbody></table>
<p>La versione da 240 cm migliora la definizione delle mappe e il rapporto segnale/rumore, mantenendo un fascio abbastanza ampio da non richiedere un tracking di alta precisione.</p>`],
    ["Catena RF e ricevitore SDR", "catena-rf-sdr", `<h2>La catena ricevente</h2><ol><li><strong>Feed</strong> ottimizzato per 1,42 GHz, al fuoco della parabola</li><li><strong>LNA</strong> con cifra di rumore inferiore a 0,6 dB, vicino al feed</li><li><strong>Filtro passa-banda</strong> a 1420 MHz (20–30 MHz di banda) contro le interferenze</li><li><strong>Cavo</strong> a bassa perdita (LMR-400) fino all'SDR</li><li><strong>SDR</strong> SDRplay RSP2pro, ADC a 14 bit</li></ol>
<blockquote><p>Il LNA va montato il più vicino possibile al feed: ogni perdita prima dell'amplificatore peggiora il rumore dell'intero sistema.</p></blockquote>`],
  ]],
  ["Software", "software", "radio", [
    ["Preparare il computer", "preparare-il-computer", `<h2>Sistema operativo</h2><p>Il PC dedicato usa <strong>Linux</strong> (Ubuntu LTS). Installa gli strumenti di base:</p>
<pre><code>sudo apt update
sudo apt install gnuradio python3-pip python3-venv
python3 -m venv ~/argh &amp;&amp; source ~/argh/bin/activate
pip install numpy scipy matplotlib astropy jupyter</code></pre>
<h2>Verifica</h2><p>Collega l'SDR via USB e controlla che il sistema lo riconosca con <code>lsusb</code>.</p>`],
    ["Analisi della riga dell'idrogeno", "analisi-riga-hi", `<h2>Dal segnale allo spettro</h2><p>La riga <strong>HI</strong> a 1420,4058 MHz si osserva calcolando lo spettro medio del segnale e sottraendo il fondo.</p>
<pre><code>import numpy as np
from scipy.signal import welch

f, p = welch(samples, fs=2.4e6, nperseg=4096)
p_db = 10 * np.log10(p / p.max())</code></pre>
<h3>Leggere il risultato</h3><ul><li>Il <mark>picco</mark> è l'emissione dell'idrogeno neutro</li><li>Lo spostamento in frequenza dà la velocità radiale (effetto Doppler)</li><li>Più picchi indicano più nubi di gas lungo la linea di vista</li></ul>`],
  ]],
  ["Scuole e didattica", "scuole", "graduation", [
    ["Laboratori STEM", "laboratori-stem", `<h2>Proposte per le classi</h2><p>Esperimenti guidati su onde radio, elettronica, fisica e acquisizione dei segnali.</p>
<h3>Attività</h3><ul><li><strong>Il Sole in radio</strong>: misurare l'emissione solare</li><li><strong>Satelliti</strong>: ricevere beacon e telemetria</li><li><strong>Interferenze</strong>: scoprire il rumore radio artificiale</li></ul>
<p>Tutto il materiale è pensato per insegnanti di scuola secondaria.</p>`],
    ["Percorsi PCTO", "percorsi-pcto", `<h2>Studenti come operatori scientifici junior</h2><p>I <strong>PCTO</strong> (Percorsi per le Competenze Trasversali e l'Orientamento) coinvolgono gli studenti in raccolta dati, programmazione e analisi in Python.</p>
<ol><li>Introduzione alla radioastronomia</li><li>Uso dell'SDR e di GNU Radio</li><li>Analisi dei dati con Python</li><li>Presentazione dei risultati</li></ol>`],
  ]],
];

async function main() {
  if ((await prisma.section.count()) > 0) { console.log("La wiki contiene già dei dati: nessuna modifica."); return; }
  let sp = 0;
  for (const [title, slug, icon, pages] of data) {
    await prisma.section.create({
      data: { title, slug, icon, position: ++sp, pages: { create: pages.map(([t, s, content], i) => ({ title: t, slug: s, content, position: i + 1 })) } },
    });
  }
  console.log("Inseriti 4 gruppi e 8 pagine di esempio.");
}
main().finally(() => prisma.$disconnect());
