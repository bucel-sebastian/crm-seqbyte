import "dotenv/config";
import { defineConfig } from "prisma/config";

function buildDatabaseUrl() {
  const user = encodeURIComponent(process.env.DB_USER ?? "postgres");
  const password = process.env.DB_PASSWORD ? `:${encodeURIComponent(process.env.DB_PASSWORD)}` : "";
  const host = process.env.DB_HOST ?? "127.0.0.1";
  const port = process.env.DB_PORT ?? "5433";
  const database = process.env.DB_NAME ?? "crm_seqbyte";

  return `postgresql://${user}${password}@${host}:${port}/${database}`;
}

process.env.DATABASE_URL = buildDatabaseUrl();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});