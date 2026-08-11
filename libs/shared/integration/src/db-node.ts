/**
 * Prisma client for plain Node.js environments (e.g. Netlify scheduled functions).
 *
 * No `server-only` guard (throws in non-Next.js runtimes) and no PrismaPg
 * adapter import (uses import.meta.url which esbuild bundles as undefined in CJS).
 * Always connects via Prisma Accelerate — DATABASE_URL must be a prisma:// URL.
 */

import { PrismaClient } from '@rocket-house-productions/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }

  const log = process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as const) : (['error'] as const);

  return new PrismaClient({
    accelerateUrl: url,
    log: [...log],
  }).$extends(withAccelerate());
};

type DatabaseClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal?: DatabaseClient;
};

export const db = globalForPrisma.prismaGlobal ?? createPrismaClient();

globalForPrisma.prismaGlobal = db;

export default db;
