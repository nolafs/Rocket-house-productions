'use server';
import { db } from '@rocket-house-productions/integration/server';

export async function assignChildToPurchase(
  formData: FormData,
): Promise<{ success: boolean; message?: string; errorMsg?: string; redirect?: string | null }> {
  const purchaseId = formData.get('purchaseId') as string;
  const childId = formData.get('childId') as string;

  if (!purchaseId || !childId) return { success: false, errorMsg: 'Missing required values.' };

  try {
    // define a redirect variable outside
    let redirect: string | null = null;

    await db.$transaction(async tx => {
      const purchase = await tx.purchase.findUnique({
        where: { id: purchaseId },
        include: { course: true },
      });

      if (!purchase) {
        // Throwing here aborts and rolls back the transaction
        throw new Error(`Purchase ${purchaseId} not found.`);
      }

      redirect = `/refresh?next=/courses/${purchase.course.slug}`;

      await tx.purchase.update({
        where: { id: purchaseId },
        data: { childId },
      });
    });

    return {
      success: true,
      message: 'Successfully assigned child to purchase.',
      redirect,
    };
  } catch (error) {
    console.error('[assignChildToPurchase]', error);
    return {
      success: false,
      errorMsg: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}
