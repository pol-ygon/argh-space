import { config } from "dotenv";
import { defineConfig } from "prisma/config";

config({ path: ".env.local" }); // Next.js usa .env.local, il CLI di Prisma di default no
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // Connessione diretta per migrazioni e seed. Opzionale: "prisma generate" (postinstall su Vercel) non si collega al database.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});
