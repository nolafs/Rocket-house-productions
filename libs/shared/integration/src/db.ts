import 'server-only';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Prisma 7 with Accelerate extension for better connection management
// Accelerate handles connection pooling, caching, and timeout management automatically

const prismaClientSingleton = () => {
  return new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  }).$extends(withAccelerate());
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
