import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function buildDatabaseUrl() {
  const user = encodeURIComponent(process.env.DB_USER ?? "postgres");
  const password = process.env.DB_PASSWORD ? `:${encodeURIComponent(process.env.DB_PASSWORD)}` : "";
  const host = process.env.DB_HOST ?? "127.0.0.1";
  const port = process.env.DB_PORT ?? "5433";
  const database = process.env.DB_NAME ?? "crm_seqbyte";

  return `postgresql://${user}${password}@${host}:${port}/${database}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    datasourceUrl: buildDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
