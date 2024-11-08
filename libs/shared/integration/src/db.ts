import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

if (typeof window === 'undefined') {
  console.log('Running in the server');
}

if (typeof window !== 'undefined') {
  console.log('Running in the browser');
  throw new Error('This file should not be imported in the browser');
}

export const db = new PrismaClient().$extends(withAccelerate());
