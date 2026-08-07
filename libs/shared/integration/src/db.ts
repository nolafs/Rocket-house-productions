import 'server-only';

import { PrismaClient } from '@rocket-house-productions/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaPg } from '@prisma/adapter-pg';

const createPrismaClient = () => {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error('DATABASE_URL is not defined');
  }

  const log = process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as const) : (['error'] as const);

  if (url.startsWith('prisma://') || url.startsWith('prisma+postgres://')) {
    return new PrismaClient({
      accelerateUrl: url,
      log: [...log],
    }).$extends(withAccelerate());
  }

  const adapter = new PrismaPg({
    connectionString: url,
  });

  return new PrismaClient({
    adapter,
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
