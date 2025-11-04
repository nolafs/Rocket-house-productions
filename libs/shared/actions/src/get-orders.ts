'use server';
import { db } from '@rocket-house-productions/integration/server';
import type { Order, PurchaseTransaction } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getAccount } from '@rocket-house-productions/actions/server';

export async function getOrders(userId: string): Promise<Partial<Order>[] | []> {
  const account = await getAccount(userId);

  if (!account) {
    throw new Error('Account not found.');
  }

  const ordersData = db.order.findMany({
    where: { accountId: account.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      createdAt: true,
      status: true,
      amountTotal: true,
      currency: true,
      metadata: true,
      completedAt: true,
      expiresAt: true,
    },
  });

  return ordersData || [];
}

export async function getAllOrders(skip: 0, take: 50): Promise<Partial<Order>[] | []> {
  // check if user is admin
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) {
    redirect('/sign-in');
  }

  if ((sessionClaims.metadata as any).role !== 'admin') {
    throw new Error('User not admin');
  }

  const ordersData = db.order.findMany({
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: take,
  });

  return ordersData || [];
}

export async function getTransactions(userId: string): Promise<Partial<PurchaseTransaction>[] | []> {
  const account = await getAccount(userId);

  if (!account) {
    throw new Error('Account not found.');
  }

  const purchaseTransactions = await db.purchaseTransaction.findMany({
    where: { accountId: account.id },
    orderBy: { createdAt: 'desc' },
  });

  return purchaseTransactions || [];
}

export async function getAllTransactions(skip: 0, take: 50): Promise<Partial<PurchaseTransaction>[] | []> {
  const { userId, sessionClaims } = await auth();

  if (!userId || !sessionClaims) {
    redirect('/sign-in');
  }

  if ((sessionClaims.metadata as any).role !== 'admin') {
    throw new Error('User not admin');
  }

  const purchaseTransactions = await db.purchaseTransaction.findMany({
    orderBy: { createdAt: 'desc' },
    skip: skip,
    take: take,
    include: {
      purchase: true,
    },
  });

  return purchaseTransactions || [];
}
