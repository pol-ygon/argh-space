// Sezione "Hardware" di A.R.G.H. (it/en). Fonte: documento di progetto A.R.G.H. 2026 (rev. 1.2);
// l'SRT del MIT Haystack è usato come riferimento tecnico, non riprodotto.
export type Doc = { slug: string; title: string; html: string };
export type PageDef = { key: string; it: Doc; en: Doc };
export const group = {
  key: "hardware", icon: "cpu",
  it: { slug: "hardware", title: "Hardware" },
  en: { slug: "hardware-system", title: "Hardware" },
  oldSlugs: ["srt-hardware", "srt-hardware-manual"], // versione precedente (traduzione del manuale): da eliminare
};

export const pages: PageDef[] = [
  // ───────── Panoramica ─────────
  {
    key: "overview",
    it: { slug: "panoramica", title: "Panoramica del sistema", html: `
<p>La stazione radioastronomica A.R.G.H. è composta da <strong>cinque sottosistemi</strong> integrati: antenna e parabola, catena RF, ricevitore SDR, sistema di controllo e puntamento, sistema software e informatico. L'architettura segue quella dello <strong>Small Radio Telescope (SRT) del MIT Haystack Observatory</strong>, adattata all'uso di un ricevitore SDR moderno e al contesto dell'Emilia-Romagna.</p>
<h2>Il sistema in sintesi</h2>
<table><tbody><tr><th>Sottosistema</th><th>Soluzione A.R.G.H.</th></tr>
<tr><td>Parabola</td><td>Primo fuoco, diametro <strong>2,4 m</strong>, banda 1–2 GHz (ottimizzata a 1,42 GHz), guadagno stimato ~30 dBi</td></tr>
<tr><td>Montatura</td><td>Equatoriale su palo con basamento</td></tr>
<tr><td>Feed</td><td>Ottimizzato per 1,42 GHz, posto al fuoco della parabola</td></tr>
<tr><td>LNA</td><td>Amplificatore a basso rumore (NF &lt; 0,6 dB) vicino al feed</td></tr>
<tr><td>Filtro</td><td>Passa-banda centrato a 1420 MHz, banda di 20–30 MHz</td></tr>
<tr><td>Cavi</td><td>Coassiale a bassa perdita (LMR-400 o equivalente), connettori SMA professionali</td></tr>
<tr><td>Ricevitore</td><td>SDRplay RSP2pro, ADC a 14 bit, fino a 10 MHz di campionamento, via USB</td></tr>
<tr><td>Puntamento</td><td>Attuatori DC comandati da Arduino o Raspberry Pi</td></tr>
<tr><td>Computer</td><td>PC Linux (Ubuntu LTS) dedicato, gruppo di continuità, NAS esterno per i dati</td></tr></tbody></table>
<h2>Il percorso del segnale</h2>
<ol><li><strong>Parabola</strong>: raccoglie e concentra il segnale radio</li><li><strong>Feed + LNA</strong>: riceve il segnale e lo amplifica con poco rumore</li><li><strong>Filtro RF</strong>: limita la banda per ridurre le interferenze</li><li><strong>Cavo</strong> fino all'interno</li><li><strong>SDR</strong>: digitalizza il segnale</li><li><strong>Software</strong>: analizza, visualizza e archivia i dati</li></ol>
<h2>Cosa cambia rispetto all'SRT</h2>
<table><tbody><tr><th>Aspetto</th><th>SRT (MIT Haystack)</th><th>A.R.G.H.</th></tr>
<tr><td>Parabola</td><td>2,3 m (prototipo)</td><td>2,4 m</td></tr>
<tr><td>Montatura</td><td>Azimut-elevazione motorizzata (SPID)</td><td>Equatoriale su palo, attuatori DC</td></tr>
<tr><td>Ricevitore</td><td>Analogico (oscillatore locale a 1416 MHz, mixer, stadi IF) con scheda A/D PCI, da costruire</td><td>SDR commerciale via USB: nessun ricevitore da costruire</td></tr>
<tr><td>Software</td><td>Programma SRT dedicato</td><td>GNU Radio, Python (NumPy, SciPy, Astropy), Jupyter</td></tr>
<tr><td>Dati</td><td>—</td><td>Formati aperti (HDF5, CSV) con metadati astronomici</td></tr></tbody></table>
<p>Il consumo complessivo è contenuto, circa <strong>100 W</strong> (circa 876 kWh l'anno). Tutto il software è open-source.</p>` },
    en: { slug: "overview", title: "System overview", html: `
<p>The A.R.G.H. radio astronomy station is made up of <strong>five integrated subsystems</strong>: antenna and dish, RF chain, SDR receiver, control and pointing system, and software and computing system. The architecture follows that of the <strong>MIT Haystack Observatory Small Radio Telescope (SRT)</strong>, adapted to a modern SDR receiver and to the context of Emilia-Romagna.</p>
<h2>The system at a glance</h2>
<table><tbody><tr><th>Subsystem</th><th>A.R.G.H. solution</th></tr>
<tr><td>Dish</td><td>Prime focus, <strong>2.4 m</strong> diameter, 1–2 GHz band (optimised for 1.42 GHz), estimated gain ~30 dBi</td></tr>
<tr><td>Mount</td><td>Equatorial, on a pole with a base</td></tr>
<tr><td>Feed</td><td>Optimised for 1.42 GHz, placed at the focus of the dish</td></tr>
<tr><td>LNA</td><td>Low-noise amplifier (NF &lt; 0.6 dB) close to the feed</td></tr>
<tr><td>Filter</td><td>Band-pass centred at 1420 MHz, 20–30 MHz bandwidth</td></tr>
<tr><td>Cables</td><td>Low-loss coaxial (LMR-400 or equivalent), professional-grade SMA connectors</td></tr>
<tr><td>Receiver</td><td>SDRplay RSP2pro, 14-bit ADC, up to 10 MHz sampling, over USB</td></tr>
<tr><td>Pointing</td><td>DC actuators driven by an Arduino or Raspberry Pi</td></tr>
<tr><td>Computer</td><td>Dedicated Linux PC (Ubuntu LTS), UPS, external NAS for the data</td></tr></tbody></table>
<h2>The signal path</h2>
<ol><li><strong>Dish</strong>: collects and concentrates the radio signal</li><li><strong>Feed + LNA</strong>: receives the signal and amplifies it with little noise</li><li><strong>RF filter</strong>: limits the bandwidth to reduce interference</li><li><strong>Cable</strong> to the indoor equipment</li><li><strong>SDR</strong>: digitises the signal</li><li><strong>Software</strong>: analyses, displays and archives the data</li></ol>
<h2>What differs from the SRT</h2>
<table><tbody><tr><th>Aspect</th><th>SRT (MIT Haystack)</th><th>A.R.G.H.</th></tr>
<tr><td>Dish</td><td>2.3 m (prototype)</td><td>2.4 m</td></tr>
<tr><td>Mount</td><td>Motorised azimuth-elevation (SPID)</td><td>Equatorial on a pole, DC actuators</td></tr>
<tr><td>Receiver</td><td>Analogue (1416 MHz local oscillator, mixers, IF stages) with a PCI A/D card, built by the user</td><td>Commercial SDR over USB: no receiver to build</td></tr>
<tr><td>Software</td><td>Dedicated SRT program</td><td>GNU Radio, Python (NumPy, SciPy, Astropy), Jupyter</td></tr>
<tr><td>Data</td><td>—</td><td>Open formats (HDF5, CSV) with astronomical metadata</td></tr></tbody></table>
<p>Overall consumption is low, about <strong>100 W</strong> (roughly 876 kWh a year). All the software is open-source.</p>` },
  },

  // ───────── Parabola e montatura ─────────
  {
    key: "dish-mount",
    it: { slug: "parabola-montatura", title: "Parabola e montatura", html: `
<h2>Nel progetto A.R.G.H.</h2>
<ul><li>Antenna parabolica a <strong>primo fuoco</strong>, diametro <strong>2,4 m</strong>.</li><li>Banda operativa 1–2 GHz, ottimizzata per la riga HI a 1,42 GHz; guadagno stimato di circa <strong>30 dBi</strong>.</li><li>Materiale: alluminio stampato, con mesh o lamiera continua.</li><li>Montatura <strong>equatoriale su palo con basamento</strong>.</li></ul>
<h2>180 cm o 240 cm?</h2>
<p>In fase di progetto sono state valutate entrambe le misure.</p>
<table><tbody><tr><th></th><th>180 cm</th><th>240 cm</th></tr>
<tr><td>Beam a 1,42 GHz</td><td>circa 8°</td><td>5–6°</td></tr>
<tr><td>Guadagno stimato</td><td>26–28 dBi</td><td>30–31 dBi</td></tr>
<tr><td>Puntamento</td><td>Molto tollerante, inseguimento semplice</td><td>Ancora tollerante, nessun tracking di alta precisione</td></tr>
<tr><td>Mappe radio</td><td>Molto grossolane</td><td>Più definite, migliore rapporto segnale/rumore</td></tr></tbody></table>
<p>Per riferimento, la Luna piena occupa circa 0,5° del cielo. Entrambe le soluzioni vanno bene per la <strong>riga HI</strong>, la distribuzione dell'idrogeno galattico e le misure Doppler. La <strong>240 cm</strong> è la configurazione preferita, compatibilmente con lo spazio disponibile nel sito.</p>
<blockquote><p>Un fascio ampio è un vantaggio: tollera piccoli errori meccanici e permette montature polari relativamente semplici.</p></blockquote>
<h2>Cosa ci insegna l'SRT</h2>
<ul>
<li><strong>Il fuoco.</strong> Il feed va posto in modo che il fuoco cada sull'asse del feed, a metà lunghezza. Per trovarlo: misurare il diametro <em>D</em> e la profondità <em>d</em> della parabola (distanza tra uno spago teso sul bordo e il centro); la lunghezza focale è <strong>f = D² / (16 · d)</strong>.</li>
<li><strong>Peso.</strong> Per il peso le parabole a rete (mesh) sono le migliori.</li>
<li><strong>Staffa su misura.</strong> Collegare la parabola all'asse della montatura richiede quasi sempre una staffa costruita apposta: va progettata con un tecnico o un ingegnere.</li>
<li><strong>Basamento in calcestruzzo.</strong> Nel prototipo l'SRT usa un pilastro con foro di circa 76 cm di diametro e 1,2 m di profondità, sotto la linea del gelo, con pareti svasate verso il fondo, ghiaia per il drenaggio, tubo tenuto in perpendicolare (controllato in due punti a 90°) fino alla presa. Sono misure di esempio per una parabola da 2,3 m: il dimensionamento va deciso con un tecnico, secondo le norme locali e la natura del terreno.</li>
<li><strong>Alternativa senza scavo.</strong> Una base non penetrante con zavorra è utile su terreno piano o tetto, ma su un tetto va verificata la portata.</li>
</ul>` },
    en: { slug: "dish-and-mount", title: "Dish and mount", html: `
<h2>In the A.R.G.H. project</h2>
<ul><li><strong>Prime-focus</strong> parabolic antenna, <strong>2.4 m</strong> diameter.</li><li>Operating band 1–2 GHz, optimised for the HI line at 1.42 GHz; estimated gain of about <strong>30 dBi</strong>.</li><li>Material: cast aluminium, with mesh or solid sheet.</li><li><strong>Equatorial mount on a pole with a base</strong>.</li></ul>
<h2>180 cm or 240 cm?</h2>
<p>Both sizes were evaluated during the design phase.</p>
<table><tbody><tr><th></th><th>180 cm</th><th>240 cm</th></tr>
<tr><td>Beam at 1.42 GHz</td><td>about 8°</td><td>5–6°</td></tr>
<tr><td>Estimated gain</td><td>26–28 dBi</td><td>30–31 dBi</td></tr>
<tr><td>Pointing</td><td>Very tolerant, simple tracking</td><td>Still tolerant, no high-precision tracking needed</td></tr>
<tr><td>Radio maps</td><td>Very coarse</td><td>Better defined, better signal-to-noise ratio</td></tr></tbody></table>
<p>For reference, the full Moon covers about 0.5° of the sky. Both work for the <strong>HI line</strong>, the distribution of galactic hydrogen and Doppler measurements. The <strong>240 cm</strong> dish is the preferred configuration, subject to the space available at the site.</p>
<blockquote><p>A wide beam is an advantage: it tolerates small mechanical errors and allows relatively simple polar mounts.</p></blockquote>
<h2>What the SRT teaches us</h2>
<ul>
<li><strong>The focus.</strong> The feed must be placed so that the focus falls on its axis, half way along its length. To find it, measure the diameter <em>D</em> and the depth <em>d</em> of the dish (distance between a string stretched across the rim and the centre); the focal length is <strong>f = D² / (16 · d)</strong>.</li>
<li><strong>Weight.</strong> For weight reasons, mesh dishes are the best.</li>
<li><strong>Custom bracket.</strong> Attaching the dish to the mount axis almost always needs a purpose-built bracket: it should be designed with a technician or an engineer.</li>
<li><strong>Concrete base.</strong> The SRT prototype uses a pier with a hole of about 76 cm in diameter and 1.2 m deep, below the frost line, with sides tapering towards the bottom, gravel for drainage, and the pipe kept plumb (checked at two points 90° apart) until the concrete sets. These are example figures for a 2.3 m dish: the sizing must be decided with a technician, following local regulations and the soil conditions.</li>
<li><strong>Alternative without digging.</strong> A non-penetrating base with ballast is useful on flat ground or a roof, but on a roof the load capacity must be checked.</li>
</ul>` },
  },

  // ───────── Feed e LNA ─────────
  {
    key: "feed-lna",
    it: { slug: "feed-lna", title: "Feed e LNA", html: `
<h2>Nel progetto A.R.G.H.</h2>
<ul><li><strong>Feed</strong> ottimizzato per 1,42 GHz, posto al fuoco della parabola.</li><li><strong>LNA</strong> (amplificatore a basso rumore) con cifra di rumore inferiore a <strong>0,6 dB</strong>, montato vicino al feed.</li></ul>
<p>Il feed raccoglie il segnale concentrato dalla parabola; l'LNA lo amplifica subito, prima che i cavi ne degradino il rapporto segnale/rumore. Ogni perdita <em>prima</em> dell'LNA peggiora il rumore dell'intero sistema.</p>
<h2>Cosa ci insegna l'SRT</h2>
<p>Nel telescopio del MIT il gruppo feed/LNA è la parte più caratteristica ed è un buon modello di riferimento:</p>
<ul>
<li><strong>Feed.</strong> Un'antenna <strong>elicoidale a basso profilo</strong> (nastro di rame avvolto su un nucleo di schiuma) montata su una <strong>cavità in alluminio</strong>. È l'unico componente da costruire da zero; gli altri richiedono poche lavorazioni.</li>
<li><strong>LNA.</strong> Sta in una <strong>scatola impermeabile</strong> fissata dietro la cavità, così blocca pochissimo l'apertura della parabola. Contiene due moduli amplificatori a bassissimo rumore, un filtro passa-banda e un bias-tee che porta l'alimentazione agli amplificatori.</li>
<li><strong>Verifica del feed.</strong> Con un analizzatore di reti si misura la perdita di ritorno (S11): il valore atteso è di circa <strong>−20 dB</strong>.</li>
<li><strong>Protezione.</strong> Uno <strong>stub in corto di un quarto d'onda</strong> sul feed offre un percorso in continua che protegge gli amplificatori da fulmini ed elettricità statica.</li>
<li><strong>Etichette.</strong> Conviene etichettare i connettori con etichette resistenti alle intemperie, per evitare collegamenti sbagliati.</li>
</ul>
<h2>Scelte ancora aperte</h2>
<ul><li>Feed autocostruito sul modello SRT oppure commerciale.</li><li>Modello di LNA e livello di guadagno.</li><li>Come alimentare l'LNA (bias-tee) e compatibilità con l'ingresso dell'RSP2pro.</li><li>Posizione e dimensione dei fori di fissaggio del feed, in base alla parabola scelta.</li></ul>` },
    en: { slug: "feed-and-lna", title: "Feed and LNA", html: `
<h2>In the A.R.G.H. project</h2>
<ul><li><strong>Feed</strong> optimised for 1.42 GHz, placed at the focus of the dish.</li><li><strong>LNA</strong> (low-noise amplifier) with a noise figure below <strong>0.6 dB</strong>, mounted close to the feed.</li></ul>
<p>The feed collects the signal concentrated by the dish; the LNA amplifies it immediately, before the cables can degrade its signal-to-noise ratio. Every loss <em>before</em> the LNA worsens the noise of the whole system.</p>
<h2>What the SRT teaches us</h2>
<p>In the MIT telescope the feed/LNA assembly is the most characteristic part and a good reference model:</p>
<ul>
<li><strong>Feed.</strong> A <strong>low-profile helical antenna</strong> (copper tape wound on a foam core) mounted on an <strong>aluminium cavity</strong>. It is the only component built from scratch; the others need little machining.</li>
<li><strong>LNA.</strong> It sits in a <strong>watertight box</strong> mounted on the back of the cavity, so it blocks very little of the dish aperture. It contains two ultra-low-noise amplifier modules, a band-pass filter and a bias-tee that supplies power to the amplifiers.</li>
<li><strong>Checking the feed.</strong> A network analyser measures the return loss (S11): the expected value is about <strong>−20 dB</strong>.</li>
<li><strong>Protection.</strong> A <strong>shorted quarter-wavelength stub</strong> on the feed provides a DC path that protects the amplifiers from lightning and static electricity.</li>
<li><strong>Labels.</strong> It is wise to label connectors with weatherproof labels, to avoid wrong connections.</li>
</ul>
<h2>Open choices</h2>
<ul><li>Home-built feed following the SRT model, or a commercial one.</li><li>LNA model and gain level.</li><li>How to power the LNA (bias-tee) and compatibility with the RSP2pro input.</li><li>Position and size of the feed mounting holes, depending on the chosen dish.</li></ul>` },
  },

  // ───────── Catena RF e cavi ─────────
  {
    key: "rf-chain",
    it: { slug: "catena-rf-cavi", title: "Catena RF e cavi", html: `
<h2>Nel progetto A.R.G.H.</h2>
<table><tbody><tr><th>Elemento</th><th>Specifica</th></tr>
<tr><td>LNA</td><td>NF &lt; 0,6 dB, vicino al feed</td></tr>
<tr><td>Filtro passa-banda</td><td>Centrato a 1420 MHz, banda di 20–30 MHz, per ridurre le interferenze (RFI)</td></tr>
<tr><td>Cavi</td><td>Coassiale a bassa perdita (LMR-400 o equivalente) dalla parabola all'SDR</td></tr>
<tr><td>Connettori</td><td>SMA di qualità professionale</td></tr></tbody></table>
<p>Il filtro restringe la banda intorno alla riga dell'idrogeno e protegge il ricevitore da segnali forti fuori banda; un cavo a bassa perdita porta il segnale all'interno senza degradarlo.</p>
<h2>Cosa ci insegna l'SRT</h2>
<ul>
<li><strong>Tratto breve flessibile + tratto lungo.</strong> Nell'SRT un breve tratto di cavo sottile (LMR-240, circa 3 m) corre sulla struttura della parabola fino alla montatura, e un lungo tratto di LMR-400 (circa 15 m) arriva all'interno.</li>
<li><strong>Fissaggio.</strong> Il cavo è fermato alla parabola ogni 15–20 cm con fascette resistenti ai raggi UV.</li>
<li><strong>Rotazione.</strong> Si lascia un tratto lento sulla montatura per consentire la rotazione completa della parabola.</li>
<li><strong>Giunzione all'aperto.</strong> Il collegamento tra i due cavi va protetto dalle intemperie (l'SRT usa un contenitore improvvisato con foro sigillato con nastro: per A.R.G.H. conviene una soluzione stagna adeguata).</li>
<li><strong>Prova della catena.</strong> L'SRT verifica il guadagno iniettando un segnale di prova a 1420 MHz (circa −80 dBm) all'ingresso dell'LNA e leggendo l'uscita: il sistema ricevitore + LNA dell'SRT arriva a circa <strong>71 dB</strong>. È un ordine di grandezza utile per pianificare il guadagno prima dell'SDR.</li>
</ul>
<blockquote><p>Cavi e connettori all'aperto sono tra le parti che si deteriorano per prime: vanno previsti controlli periodici nella manutenzione ordinaria.</p></blockquote>` },
    en: { slug: "rf-chain-and-cables", title: "RF chain and cables", html: `
<h2>In the A.R.G.H. project</h2>
<table><tbody><tr><th>Element</th><th>Specification</th></tr>
<tr><td>LNA</td><td>NF &lt; 0.6 dB, close to the feed</td></tr>
<tr><td>Band-pass filter</td><td>Centred at 1420 MHz, 20–30 MHz bandwidth, to reduce interference (RFI)</td></tr>
<tr><td>Cables</td><td>Low-loss coaxial (LMR-400 or equivalent) from the dish to the SDR</td></tr>
<tr><td>Connectors</td><td>Professional-grade SMA</td></tr></tbody></table>
<p>The filter narrows the bandwidth around the hydrogen line and protects the receiver from strong out-of-band signals; a low-loss cable carries the signal indoors without degrading it.</p>
<h2>What the SRT teaches us</h2>
<ul>
<li><strong>Short flexible run + long run.</strong> On the SRT a short run of thin cable (LMR-240, about 3 m) runs along the dish structure to the mount, and a long run of LMR-400 (about 15 m) goes indoors.</li>
<li><strong>Fixing.</strong> The cable is secured to the dish every 15–20 cm with UV-resistant ties.</li>
<li><strong>Rotation.</strong> A loose section is left at the mount to allow the dish to rotate fully.</li>
<li><strong>Outdoor joint.</strong> The connection between the two cables must be protected from the weather (the SRT uses an improvised container with a taped hole: for A.R.G.H. a proper watertight solution is preferable).</li>
<li><strong>Testing the chain.</strong> The SRT checks the gain by injecting a test signal at 1420 MHz (about −80 dBm) at the LNA input and reading the output: the SRT receiver + LNA system reaches about <strong>71 dB</strong>. It is a useful order of magnitude when planning the gain ahead of the SDR.</li>
</ul>
<blockquote><p>Outdoor cables and connectors are among the first parts to deteriorate: periodic checks should be part of routine maintenance.</p></blockquote>` },
  },

  // ───────── SDR e computer ─────────
  {
    key: "sdr-computer",
    it: { slug: "sdr-computer", title: "Ricevitore SDR e computer", html: `
<h2>Ricevitore SDR</h2>
<ul><li>Modello: <strong>SDRplay RSP2pro</strong>.</li><li>Frequenza di campionamento fino a <strong>10 MHz</strong>, risoluzione ADC a <strong>14 bit</strong>.</li><li>Acquisizione via <strong>USB</strong> su un computer Linux dedicato.</li></ul>
<p>Un ricevitore SDR (Software Defined Radio) digitalizza il segnale e lo elabora via software. Nel progetto sostituisce l'intera parte analogica dell'SRT: mixer, oscillatore locale, amplificatori a frequenza intermedia, filtri e scheda A/D. Non c'è quindi un ricevitore da costruire, ma restano importanti il guadagno e il filtraggio <em>prima</em> dell'SDR.</p>
<h2>Computer e dati</h2>
<ul>
<li><strong>PC dedicato</strong> con Linux (Ubuntu LTS).</li>
<li><strong>Software</strong> di acquisizione: GNU Radio, rtl_power, SdrSharp (compatibile con Wine) o CygnusRFI.</li>
<li><strong>Analisi</strong>: Python 3 con NumPy, SciPy, Matplotlib e Astropy; Jupyter Notebook per le osservazioni interattive con gli studenti.</li>
<li><strong>Archiviazione</strong>: NAS esterno con dischi dedicati; dataset in formati aperti (HDF5, CSV) con metadati astronomici.</li>
<li><strong>Continuità</strong>: gruppo di continuità per proteggere strumenti e dati da sbalzi e interruzioni di corrente.</li>
</ul>
<blockquote><p>Tutto il software è open-source e liberamente riproducibile.</p></blockquote>` },
    en: { slug: "sdr-and-computer", title: "SDR receiver and computer", html: `
<h2>SDR receiver</h2>
<ul><li>Model: <strong>SDRplay RSP2pro</strong>.</li><li>Sampling rate up to <strong>10 MHz</strong>, <strong>14-bit</strong> ADC resolution.</li><li>Acquisition over <strong>USB</strong> on a dedicated Linux computer.</li></ul>
<p>An SDR (Software Defined Radio) receiver digitises the signal and processes it in software. In this project it replaces the whole analogue part of the SRT: mixers, local oscillator, intermediate-frequency amplifiers, filters and the A/D card. There is no receiver to build, but gain and filtering <em>ahead of</em> the SDR remain important.</p>
<h2>Computer and data</h2>
<ul>
<li><strong>Dedicated PC</strong> running Linux (Ubuntu LTS).</li>
<li>Acquisition <strong>software</strong>: GNU Radio, rtl_power, SdrSharp (Wine-compatible) or CygnusRFI.</li>
<li><strong>Analysis</strong>: Python 3 with NumPy, SciPy, Matplotlib and Astropy; Jupyter Notebook for interactive observations with students.</li>
<li><strong>Storage</strong>: external NAS with dedicated disks; datasets in open formats (HDF5, CSV) with astronomical metadata.</li>
<li><strong>Continuity</strong>: an uninterruptible power supply to protect instruments and data from surges and power cuts.</li>
</ul>
<blockquote><p>All the software is open-source and freely reproducible.</p></blockquote>` },
  },

  // ───────── Puntamento e calibrazione ─────────
  {
    key: "pointing",
    it: { slug: "puntamento-calibrazione", title: "Puntamento e calibrazione", html: `
<h2>Nel progetto A.R.G.H.</h2>
<ul><li>Montatura equatoriale con <strong>attuatori DC</strong> controllati digitalmente.</li><li><strong>Controller</strong>: Arduino o Raspberry Pi con shield per motori.</li><li><strong>Software di tracking</strong>: Stellarium con plugin, GPredict per i satelliti, SkyChart.</li><li><strong>Comunicazione</strong>: USB seriale tra il computer principale e il controller dei motori.</li></ul>
<p>Con un fascio di 5–6° non servono sistemi di inseguimento ad alta precisione, e piccoli errori meccanici sono tollerati.</p>
<h2>Cosa ci insegna l'SRT</h2>
<h3>Conoscere dove punta il telescopio</h3>
<p>Per inseguire con precisione gli oggetti, il computer deve sapere dove punta la parabola. Nell'SRT questo si ottiene portando il telescopio a una posizione di riferimento (puntata esattamente al <strong>nord geografico</strong>) e azzerando il controller. Il nord vero si ricava con una bussola, conoscendo la <strong>declinazione magnetica</strong> del luogo (calcolabile dal sito della NOAA).</p>
<p>Per una montatura equatoriale vale lo stesso principio: l'allineamento dell'asse polare e la posizione di riferimento vanno definiti con cura e verificati su oggetti noti, come il Sole.</p>
<h3>Limiti di corsa</h3>
<p>L'SRT usa limiti di corsa sia con finecorsa sia elettronici nel controller. Anche per A.R.G.H. conviene prevedere limiti di sicurezza, sia fisici sia nel software, prima di far muovere la parabola.</p>
<h3>Calibrazione con un assorbitore</h3>
<p>La calibrazione è più precisa se il telescopio punta un <strong>assorbitore</strong>. Le possibilità sono tre:</p>
<ul><li><strong>assorbitore tenuto a mano</strong> davanti al feed: blocca gran parte di interferenze ed emissione HI, ma riflette un po' di rumore dell'LNA;</li><li><strong>assorbitore su attuatore</strong> che lo sposta davanti al feed;</li><li><strong>un albero o un cespuglio</strong> all'orizzonte in cui puntare, che non riflette il rumore dell'LNA.</li></ul>
<p>La schiuma dell'assorbitore va protetta da intemperie e animali, che potrebbero usarla come nido.</p>` },
    en: { slug: "pointing-and-calibration", title: "Pointing and calibration", html: `
<h2>In the A.R.G.H. project</h2>
<ul><li>Equatorial mount with digitally controlled <strong>DC actuators</strong>.</li><li><strong>Controller</strong>: Arduino or Raspberry Pi with a motor shield.</li><li><strong>Tracking software</strong>: Stellarium with plugins, GPredict for satellites, SkyChart.</li><li><strong>Communication</strong>: serial over USB between the main computer and the motor controller.</li></ul>
<p>With a 5–6° beam, high-precision tracking systems are not required, and small mechanical errors are tolerated.</p>
<h2>What the SRT teaches us</h2>
<h3>Knowing where the telescope points</h3>
<p>To track objects accurately, the computer must know where the dish is pointing. On the SRT this is achieved by taking the telescope to a reference position (pointed exactly at <strong>true north</strong>) and resetting the controller. True north is found with a compass, knowing the local <strong>magnetic declination</strong> (which can be calculated on the NOAA website).</p>
<p>For an equatorial mount the same principle applies: the alignment of the polar axis and the reference position must be defined carefully and checked on known objects, such as the Sun.</p>
<h3>Travel limits</h3>
<p>The SRT uses travel limits, both limit switches and electronic limits in the controller. A.R.G.H. should also provide safety limits, both physical and in software, before the dish is moved.</p>
<h3>Calibration with an absorber</h3>
<p>Calibration is more accurate if the telescope points at an <strong>absorber</strong>. There are three possibilities:</p>
<ul><li>an <strong>absorber held by hand</strong> in front of the feed: it blocks most interference and HI emission, but reflects some LNA noise;</li><li>an <strong>absorber on an actuator</strong> that moves it in front of the feed;</li><li>a <strong>tree or bush</strong> on the horizon to point into, which does not reflect LNA noise.</li></ul>
<p>The absorber foam must be protected from weather and from animals, which might use it as a nest.</p>` },
  },

  // ───────── Sito, alimentazione e protezioni ─────────
  {
    key: "site",
    it: { slug: "sito-alimentazione", title: "Sito, alimentazione e protezioni", html: `
<p>La scelta del sito è un elemento fondamentale per il successo del progetto. La posizione definitiva dell'impianto è <strong>in fase di valutazione</strong>: saranno privilegiati i siti con basso rumore radioelettrico.</p>
<h2>Requisiti del sito</h2>
<ul><li>Spazio libero sufficiente per muovere la parabola (per la 240 cm, uno spazio idoneo è condizione necessaria).</li><li>Terreno stabile dal punto di vista meccanico.</li><li>Basso livello di interferenze radio (RFI).</li><li>Accesso all'alimentazione elettrica e alla rete dati.</li><li>Sicurezza per le attività didattiche e divulgative.</li></ul>
<h2>Cosa ci insegna l'SRT</h2>
<ul>
<li><strong>Lontano dagli edifici.</strong> Tenere il telescopio il più lontano possibile da edifici, computer ed elettronica riduce le interferenze.</li>
<li><strong>Cielo libero.</strong> Meno ostacoli verso il cielo possibile; un albero vicino può invece servire da assorbitore per la calibrazione.</li>
<li><strong>Su un tetto.</strong> Una base non penetrante con zavorra è un'alternativa allo scavo, ma richiede di verificare che il tetto regga il carico.</li>
</ul>
<h2>Alimentazione</h2>
<ul><li>Consumo contenuto, circa <strong>100 W</strong> (circa 876 kWh l'anno).</li><li>Un <strong>gruppo di continuità</strong> protegge strumenti e dati.</li></ul>
<h2>Protezioni e manutenzione</h2>
<ul><li><strong>Fulmini ed elettricità statica</strong>: percorso di scarica sul feed (stub in corto) e un buon collegamento a terra dell'impianto.</li><li><strong>Intemperie</strong>: scatole stagne per LNA e giunzioni, fascette resistenti ai raggi UV, connettori etichettati.</li><li><strong>Manutenzione ordinaria</strong>: controlli periodici e sostituzione dei componenti soggetti a usura, come cavi e connettori esterni.</li></ul>` },
    en: { slug: "site-power-protection", title: "Site, power and protection", html: `
<p>Choosing the installation site is fundamental to the success of the project. The final location of the facility is <strong>still being evaluated</strong>: sites with low radio-electric noise will be preferred.</p>
<h2>Site requirements</h2>
<ul><li>Enough free space to move the dish (for the 240 cm dish, suitable space is a necessary condition).</li><li>Mechanically stable ground.</li><li>Low level of radio interference (RFI).</li><li>Access to electrical power and to the data network.</li><li>Safety for educational and outreach activities.</li></ul>
<h2>What the SRT teaches us</h2>
<ul>
<li><strong>Away from buildings.</strong> Keeping the telescope as far as possible from buildings, computers and electronics reduces interference.</li>
<li><strong>Clear sky.</strong> As few obstructions to the sky as possible; a nearby tree, however, can act as an absorber for calibration.</li>
<li><strong>On a roof.</strong> A non-penetrating base with ballast is an alternative to digging, but the roof must be checked to see that it can bear the load.</li>
</ul>
<h2>Power</h2>
<ul><li>Low consumption, about <strong>100 W</strong> (roughly 876 kWh a year).</li><li>An <strong>uninterruptible power supply</strong> protects instruments and data.</li></ul>
<h2>Protection and maintenance</h2>
<ul><li><strong>Lightning and static electricity</strong>: a discharge path on the feed (shorted stub) and a good earth connection for the installation.</li><li><strong>Weather</strong>: watertight boxes for the LNA and joints, UV-resistant cable ties, labelled connectors.</li><li><strong>Routine maintenance</strong>: periodic checks and replacement of parts subject to wear, such as outdoor cables and connectors.</li></ul>` },
  },

  // ───────── Riferimento SRT ─────────
  {
    key: "srt-reference",
    it: { slug: "riferimento-srt", title: "Riferimento: l'SRT del MIT Haystack", html: `
<p>Il progetto A.R.G.H. si basa sul <strong>Small Radio Telescope (SRT)</strong> sviluppato dal <strong>MIT Haystack Observatory</strong>. Il manuale di riferimento è l'<em>Hardware Installation Manual</em>, compilato da Dustin Johnson tra giugno e agosto 2012.</p>
<h2>Cosa riprendiamo</h2>
<ul><li>L'architettura a cinque sottosistemi: parabola, feed + LNA, ricevitore, controllo della montatura, acquisizione dati.</li><li>L'approccio costruttivo: componenti commerciali, poche lavorazioni meccaniche, schemi aperti.</li><li>Le soluzioni pratiche per feed, LNA, cavi, puntamento e calibrazione, descritte nelle pagine di questa sezione.</li></ul>
<h2>Cosa è diverso</h2>
<p>Parabola da 2,4 m su montatura equatoriale, ricevitore SDR al posto di quello analogico con scheda PCI, software open-source in Python e GNU Radio. Il confronto è nella pagina <em>Panoramica del sistema</em>.</p>
<h2>Per i dettagli costruttivi</h2>
<p>Per quote meccaniche, schemi elettrici e istruzioni di montaggio del feed e dell'LNA, il riferimento resta il manuale originale: queste pagine non lo riproducono. Le informazioni dell'SRT riportate qui sono da verificare sul documento originale prima di essere usate per costruire.</p>
<blockquote><p>Crediti: MIT Haystack Observatory, <a href="https://www.haystack.mit.edu">www.haystack.mit.edu</a>; D. Johnson, <em>SRT Hardware Installation Manual</em>, 2012.</p></blockquote>` },
    en: { slug: "srt-reference", title: "Reference: the MIT Haystack SRT", html: `
<p>The A.R.G.H. project is based on the <strong>Small Radio Telescope (SRT)</strong> developed by the <strong>MIT Haystack Observatory</strong>. The reference manual is the <em>Hardware Installation Manual</em>, compiled by Dustin Johnson in June–August 2012.</p>
<h2>What we take from it</h2>
<ul><li>The five-subsystem architecture: dish, feed + LNA, receiver, mount control, data acquisition.</li><li>The construction approach: commercial components, minimal machining, open designs.</li><li>The practical solutions for feed, LNA, cables, pointing and calibration, described in the pages of this section.</li></ul>
<h2>What is different</h2>
<p>A 2.4 m dish on an equatorial mount, an SDR receiver instead of the analogue one with a PCI card, open-source software in Python and GNU Radio. The comparison is on the <em>System overview</em> page.</p>
<h2>For construction details</h2>
<p>For mechanical dimensions, electrical schematics and assembly instructions for the feed and LNA, the original manual remains the reference: these pages do not reproduce it. The SRT information given here should be checked against the original document before being used for construction.</p>
<blockquote><p>Credits: MIT Haystack Observatory, <a href="https://www.haystack.mit.edu">www.haystack.mit.edu</a>; D. Johnson, <em>SRT Hardware Installation Manual</em>, 2012.</p></blockquote>` },
  },
];
