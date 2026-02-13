import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Prisma client singleton.
 *
 * Prisma v7 requires a Driver Adapter for direct database connections.
 * We use @prisma/adapter-pg backed by a pg Pool.
 *
 * In development, the singleton survives hot-reloads to prevent
 * exhausting the database connection pool.
 */

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
