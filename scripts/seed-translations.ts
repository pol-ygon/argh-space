// Aggiunge la versione inglese dei gruppi "Per iniziare", "Software" e "Scuole e didattica"
// e collega le traduzioni (stessa "key"). Le pagine italiane non vengono modificate, solo collegate.
// Uso: npm run seed:translations   (le pagine inglesi esistenti vengono sostituite)
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { clean } from "../src/lib/content";

config({ path: ".env.local" });
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

type P = { key: string; itSlug: string; slug: string; title: string; html: string };
type G = { key: string; itSlug: string; slug: string; title: string; icon: string; position: number; pages: P[] };

const groups: G[] = [
  { key: "getting-started", itSlug: "per-iniziare", slug: "getting-started", title: "Getting started", icon: "rocket", position: 1, pages: [
    { key: "welcome", itSlug: "benvenuti", slug: "welcome", title: "Welcome to A.R.G.H.", html: `<p><strong>A.R.G.H.</strong> (<em>Astronomical Radio Ground Hub</em>) is an educational and scientific platform for radio astronomy, built around a <mark>2.4-metre</mark> dish and low-cost SDR receivers.</p>
<h2>What you will find in this wiki</h2><ul><li>The <strong>technical guides</strong> to build and configure the radio telescope</li><li>The <strong>software</strong> and examples of data analysis</li><li>The <strong>teaching</strong> material for schools and teachers</li></ul>
<blockquote><p>The central idea: not just looking at the sky, but learning to measure it.</p></blockquote>
<h2>The project in numbers</h2>
<table><tbody><tr><th>Parameter</th><th>Value</th></tr><tr><td>Dish diameter</td><td>2.4 m</td></tr><tr><td>HI line frequency</td><td>1420.4058 MHz</td></tr><tr><td>Acquisition band</td><td>1.3–1.7 GHz</td></tr><tr><td>Project duration</td><td>12 months</td></tr></tbody></table>
<p>The project is inspired by the <a href="https://www.haystack.mit.edu">Small Radio Telescope of the MIT Haystack Observatory</a>.</p>` },
    { key: "contribute", itSlug: "come-contribuire", slug: "how-to-contribute", title: "How to contribute", html: `<h2>Many ways to take part</h2><p>A.R.G.H. is an open project: every skill is welcome.</p>
<h3>Technical skills</h3><ol><li>RF electronics and antennas</li><li>Programming in <code>Python</code> and GNU Radio</li><li>Mechanics and installation</li></ol>
<h3>Schools and outreach</h3><ul><li>Classroom workshops</li><li>Public observing evenings</li></ul>
<hr><p>To get involved, write to <a href="mailto:info@argh.space">info@argh.space</a>.</p>` },
  ] },
  { key: "software", itSlug: "software", slug: "software-tools", title: "Software", icon: "radio", position: 3, pages: [
    { key: "setup", itSlug: "preparare-il-computer", slug: "preparing-the-computer", title: "Preparing the computer", html: `<h2>Operating system</h2><p>The dedicated PC runs <strong>Linux</strong> (Ubuntu LTS). Install the basic tools:</p>
<pre><code>sudo apt update
sudo apt install gnuradio python3-pip python3-venv
python3 -m venv ~/argh &amp;&amp; source ~/argh/bin/activate
pip install numpy scipy matplotlib astropy jupyter</code></pre>
<h2>Check</h2><p>Connect the SDR via USB and check that the system recognises it with <code>lsusb</code>.</p>` },
    { key: "hi-analysis", itSlug: "analisi-riga-hi", slug: "hydrogen-line-analysis", title: "Analysing the hydrogen line", html: `<h2>From signal to spectrum</h2><p>The <strong>HI</strong> line at 1420.4058 MHz is observed by computing the average spectrum of the signal and subtracting the background.</p>
<pre><code>import numpy as np
from scipy.signal import welch

f, p = welch(samples, fs=2.4e6, nperseg=4096)
p_db = 10 * np.log10(p / p.max())</code></pre>
<h3>Reading the result</h3><ul><li>The <mark>peak</mark> is the emission of neutral hydrogen</li><li>The frequency shift gives the radial velocity (Doppler effect)</li><li>More peaks indicate more gas clouds along the line of sight</li></ul>` },
  ] },
  { key: "schools", itSlug: "scuole", slug: "schools-and-education", title: "Schools and education", icon: "graduation", position: 4, pages: [
    { key: "stem-labs", itSlug: "laboratori-stem", slug: "stem-labs", title: "STEM labs", html: `<h2>Proposals for classes</h2><p>Guided experiments on radio waves, electronics, physics and signal acquisition.</p>
<h3>Activities</h3><ul><li><strong>The Sun in radio</strong>: measuring solar emission</li><li><strong>Satellites</strong>: receiving beacons and telemetry</li><li><strong>Interference</strong>: discovering artificial radio noise</li></ul>
<p>All the material is designed for secondary-school teachers.</p>` },
    { key: "pcto", itSlug: "percorsi-pcto", slug: "pcto-programmes", title: "PCTO programmes", html: `<h2>Students as junior scientific operators</h2><p>The <strong>PCTO</strong> programmes (Italian work-experience pathways for transversal skills and orientation) involve students in data collection, programming and analysis in Python.</p>
<ol><li>Introduction to radio astronomy</li><li>Using the SDR and GNU Radio</li><li>Data analysis with Python</li><li>Presenting the results</li></ol>` },
  ] },
];

async function main() {
  for (const g of groups) {
    // 1) collega la versione italiana (solo "key")
    const it = await prisma.section.findUnique({ where: { slug: g.itSlug }, include: { pages: true } });
    if (!it) { console.log(`Gruppo italiano "${g.itSlug}" non trovato: salto`); continue; }
    await prisma.section.update({ where: { id: it.id }, data: { key: g.key } });
    for (const p of g.pages) await prisma.page.updateMany({ where: { sectionId: it.id, slug: p.itSlug }, data: { key: p.key } });
    // 2) crea/sostituisce la versione inglese
    const found = await prisma.section.findUnique({ where: { slug: g.slug } });
    const en = found
      ? await prisma.section.update({ where: { id: found.id }, data: { title: g.title, icon: g.icon, lang: "en", key: g.key, position: g.position } })
      : await prisma.section.create({ data: { title: g.title, slug: g.slug, icon: g.icon, lang: "en", key: g.key, position: g.position } });
    await prisma.page.deleteMany({ where: { sectionId: en.id } });
    await prisma.page.createMany({ data: g.pages.map((p, i) => ({ sectionId: en.id, slug: p.slug, title: p.title, content: clean(p.html), key: p.key, position: i + 1 })) });
    console.log(`[en] ${g.title}: ${g.pages.length} pagine (collegate a "${g.itSlug}")`);
  }
  // l'ordine dei gruppi inglesi rispecchia quello italiano: Getting started, Hardware, Software, Schools
  await prisma.section.updateMany({ where: { slug: "hardware-system" }, data: { position: 2 } });
}
main().finally(() => prisma.$disconnect());
