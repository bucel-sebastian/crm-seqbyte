import { spawnSync } from "node:child_process";

function buildDatabaseUrl() {
  const user = encodeURIComponent(process.env.DB_USER ?? "postgres");
  const password = process.env.DB_PASSWORD ? `:${encodeURIComponent(process.env.DB_PASSWORD)}` : "";
  const host = process.env.DB_HOST ?? "127.0.0.1";
  const port = process.env.DB_PORT ?? "5433";
  const database = process.env.DB_NAME ?? "crm_seqbyte";

  return `postgresql://${user}${password}@${host}:${port}/${database}`;
}

const args = process.argv.slice(2);
const result = spawnSync("pnpm", ["exec", "prisma", ...args], {
  stdio: "inherit",
  env: {
    ...process.env,
    DATABASE_URL: buildDatabaseUrl(),
  },
});

process.exit(result.status ?? 1);