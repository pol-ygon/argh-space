# A.R.G.H. – Astronomical Radio Ground Hub

Sito del progetto **A.R.G.H.**, radiotelescopio educativo in Emilia-Romagna
(referente: Paolo Marzi, IU4UCW; associazione di supporto: ARI Reggio Emilia).

Il repository contiene:

- la **landing page** (`argh.space`), bilingue IT/EN;
- la **wiki** (`wiki.argh.space`), con contenuti bilingue collegati tra loro;
- l'**area admin** (`/admin`) per gestire gruppi e pagine della wiki con un editor rich text.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) e React
- Prisma 7 + Postgres (Prisma Postgres), driver `@prisma/adapter-pg`
- Tiptap v3 per l'editor rich text, `sanitize-html` per ripulire i contenuti
- `jose` per l'autenticazione admin (cookie JWT)
- Lucide per le icone
- Deploy su Vercel, regione `fra1`

## Requisiti

- Node.js 20 o superiore
- Un database Postgres raggiungibile (es. Prisma Postgres)

## Avvio in locale

```bash
npm install            # esegue anche `prisma generate`
cp .env.example .env.local
# compila .env.local (vedi sotto)
npm run db:migrate     # applica le migrazioni
npm run dev
```

Il sito è su <http://localhost:3000>, l'admin su <http://localhost:3000/admin>.

### Variabili d'ambiente

| Variabile | Descrizione |
| --- | --- |
| `ADMIN_USER` / `ADMIN_PASSWORD` | Credenziali del login `/admin` |
| `AUTH_SECRET` | Stringa casuale (almeno 32 caratteri) per firmare la sessione |
| `DATABASE_URL` | Connessione diretta, usata da migrazioni e seed |
| `DATABASE_URL_POOLED` | Connessione pooled, usata dall'app se presente (consigliata su Vercel) |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico del sito (canonical, sitemap) |
| `NEXT_PUBLIC_WIKI_URL` | URL pubblico della wiki |

Non committare `.env.local`. Cambia `ADMIN_PASSWORD` e `AUTH_SECRET` prima di andare online.

## Script

| Comando | Cosa fa |
| --- | --- |
| `npm run dev` | Server di sviluppo |
| `npm run build` | `prisma generate` + build di produzione |
| `npm start` | Avvia la build di produzione |
| `npm run db:migrate` | Applica le migrazioni (`prisma migrate deploy`) |
| `npm run db:studio` | Apre Prisma Studio |
| `npm run seed` | Gruppi e pagine di esempio |
| `npm run seed:hardware` | Sezione Hardware (IT `hardware`, EN `hardware-system`) |
| `npm run seed:translations` | Traduzioni EN di Per iniziare, Software, Scuole |

Gli script di seed **sostituiscono** le pagine dei gruppi che gestiscono, comprese le
modifiche fatte dall'admin: non rilanciarli su contenuti già rivisti.

## Struttura

```
prisma/               schema e migrazioni
scripts/              seed dei contenuti della wiki
src/proxy.ts          riscrittura dell'host wiki.* verso /wiki
src/lib/              db, auth, azioni server, contenuti, SEO, i18n
src/lib/i18n/         dizionari it/en per landing, wiki e pagine legali
src/app/              landing, /wiki, /admin, /privacy, /cookie, sitemap, robots
public/               logo e immagini
```

## Come funziona

### Wiki su un sottodominio

`src/proxy.ts` riscrive le richieste dell'host `wiki.*` verso `/wiki`, quindi la wiki
risponde su `wiki.argh.space` senza prefisso. Sul dominio principale resta sotto `/wiki`.
Sitemap, robots e canonical tengono conto dell'host.

### Lingue

- La lingua si sceglie dal cookie `lang`, poi da `Accept-Language`
  (lingue diverse da it/en → en; nessuna indicazione → it), con un fallback lato client.
- Ogni gruppo (`Section`) ha una lingua; le traduzioni sono collegate dal campo **key**
  (stessa key su gruppo e pagina nelle due lingue).
- Il selettore lingua porta alla pagina tradotta; le pagine hanno gli alternate `hreflang`.

### Admin

Su `/admin`, dopo il login, si possono creare, rinominare, riordinare ed eliminare gruppi e pagine,
scegliere l'icona del gruppo, pubblicare o nascondere una pagina. Per collegare una pagina alla sua
traduzione usa lo stesso valore nel campo "Collegamento traduzione", sia sul gruppo sia sulla pagina.
L'area admin è marcata `noindex`.

### Contenuti

Le pagine sono salvate come HTML, ripulito con `sanitize-html`. I titoli ricevono un `id`
e la pagina mostra un indice laterale. Il vecchio Markdown viene convertito al volo.

### SEO

Metadata per pagina, `sitemap.xml`, `robots.txt`, Open Graph e Twitter card, manifest,
JSON-LD (Organization, WebSite, TechArticle, BreadcrumbList).

## Deploy su Vercel

1. Importa il repository su Vercel (la regione `fra1` è in `vercel.json`).
2. Imposta le variabili d'ambiente della tabella sopra.
3. Applica le migrazioni al database con `npm run db:migrate` (da locale, con `DATABASE_URL`).
4. Aggiungi i domini `argh.space` e `wiki.argh.space` allo stesso progetto.

`postinstall` e `build` eseguono `prisma generate`, quindi l'installazione funziona anche
senza `DATABASE_URL`.

## Note

- Cookie: il sito usa solo cookie tecnici (sessione admin e preferenza lingua).
- I PDF e `unnamed.png` nella radice sono materiale di riferimento, non usato dal sito.
