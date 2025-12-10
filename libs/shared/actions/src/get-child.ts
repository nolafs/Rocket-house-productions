'use server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getAccountData } from './get-account';
import { cache } from 'react';
import { Child } from '@prisma/client';

/**
 * Creates a free purchase for a course if it doesn't exist
 * This allows users with membership to preview courses they haven't purchased
 */
async function createFreePurchaseIfNeeded(accountId: string, courseSlug: string) {
  // First, find the course by slug
  const course = await db.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true },
  });

  if (!course) {
    throw new Error(`Course not found for slug: ${courseSlug}`);
  }

  // Check if a purchase already exists
  const existingPurchase = await db.purchase.findFirst({
    where: {
      accountId,
      courseId: course.id,
    },
  });

  if (existingPurchase) {
    return existingPurchase;
  }

  // Create a free purchase
  const freePurchase = await db.purchase.create({
    data: {
      accountId,
      courseId: course.id,
      type: 'free',
      category: 'free',
      amount: 0,
    },
  });

  console.log('[createFreePurchaseIfNeeded] Created free purchase:', freePurchase.id);
  return freePurchase;
}

export const getChild = cache(async (slug: string, next = true) => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const account = await getAccountData(userId);

  // Check if account has an id (not a NoAccountData)
  if (!('id' in account) || !account.id) {
    return redirect(`/courses/error?status=error&message=Account%20not%20found`);
  }

  let purchase = account.purchases?.find(p => p.course?.slug === slug);

  console.log('[getChild] sessionClaims', sessionClaims);
  console.log('[getChild] account', account);

  const isAdmin = (sessionClaims?.metadata as { role: string })?.role === 'admin';
  let child: Child | null = null;

  // If no purchase found, create a free purchase to allow preview access
  if (!purchase) {
    console.log('[getChild] No purchase found, creating free purchase for preview access');
    try {
      const newPurchase = await createFreePurchaseIfNeeded(account.id, slug);
      purchase = {
        id: newPurchase.id,
        childId: newPurchase.childId,
        type: newPurchase.type,
        category: newPurchase.category,
        course: { slug, id: newPurchase.courseId },
      };
    } catch (error) {
      console.error('[getChild] Failed to create free purchase:', error);
      return redirect(`/courses/error?status=error&message=Unable%20to%20access%20course`);
    }
  }

  if (!purchase) {
    return redirect(`/courses/error?status=error&message=Unable%20to%20access%20course`);
  }

  if (!isAdmin) {
    // Case 1: Purchase exists but no child enrolled
    if (!purchase.childId) {
      // Check if account has any children
      child = await db.child.findFirst({
        where: {
          accountId: account.id,
        },
      });

      // If no child exists at all and `next` is true, redirect to enrollment
      if (!child && next) {
        return redirect(`/courses/enroll/${purchase.id}`);
      }

      // Return with no enrolled child data
      return {
        data: null,
        defaultData: child,
        purchaseId: purchase.id,
        purchaseType: purchase.type || 'free',
        purchaseCategory: purchase.category || 'free',
      };
    }

    // Case 2: Purchase exists with enrolled child
    child = await db.child.findFirst({
      where: {
        id: purchase.childId,
      },
    });

    return {
      data: child,
      defaultData: child,
      purchaseId: purchase.id,
      purchaseType: purchase.type || 'free',
      purchaseCategory: purchase.category || 'free',
    };
  }

  // Admin flow
  if (!purchase.childId) {
    // Get first child for admin if no specific child assigned
    child = await db.child.findFirst({
      where: {
        accountId: account.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  } else {
    child = await db.child.findFirst({
      where: {
        id: purchase.childId,
      },
    });
  }

  if (!child) {
    return redirect(`/courses/error?status=error&message=No%20child%20found`);
  }

  return {
    data: child,
    defaultData: child,
    purchaseId: purchase.id,
    purchaseType: purchase.type || 'free',
    purchaseCategory: purchase.category || 'free',
  };
});
