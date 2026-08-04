import 'server-only';
import { PrismaClient } from '@rocket-house-productions/prisma-client';
import { withAccelerate } from '@prisma/extension-accelerate';

import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prismaClientSingleton = () => {
  const url = process.env.DATABASE_URL!;
  const log = process.env.NODE_ENV === 'development' ? (['query', 'error', 'warn'] as const) : (['error'] as const);

  if (url.startsWith('prisma://')) {
    return new PrismaClient({ accelerateUrl: url, log: [...log] }).$extends(withAccelerate());
  }

  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter, log: [...log] });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
