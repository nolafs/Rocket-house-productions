'use server';
import { OnBoardingType, stepTwoSchema, stepOneSchema, stepThreeSchema } from '../_component/schemas';
import { OnBoardingRoutes } from '../_component/path-types';
import { db } from '@rocket-house-productions/integration/server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { MailerList } from '@rocket-house-productions/actions/server';
import { logger } from '@rocket-house-productions/util';

interface SubmitDealActionReturnType {
  redirect?: OnBoardingRoutes;
  errorMsg?: string;
  success?: boolean;
}

export const submitOnBoardingAction = async (
  onboarding: OnBoardingType,
  baseUrl: string,
): Promise<SubmitDealActionReturnType> => {
  const stepOneValidated = stepOneSchema.safeParse(onboarding);
  if (!stepOneValidated.success) {
    return {
      redirect: OnBoardingRoutes.PARENT_DETAILS,
      errorMsg: 'Please validate parent information.',
    };
  }

  const stepTwoValidated = stepTwoSchema.safeParse(onboarding);
  if (!stepTwoValidated.success) {
    return {
      redirect: OnBoardingRoutes.CHILD_DETAILS,
      errorMsg: 'Please validate child information.',
    };
  }

  const stepThreeValidated = stepThreeSchema.safeParse(onboarding);

  if (!stepThreeValidated.success) {
    return {
      redirect: OnBoardingRoutes.CHILD_AVATAR,
      errorMsg: 'Please validate avatar.',
    };
  }

  // Add child
  try {
    const { userId } = await auth();

    if (!userId) {
      return redirect('/course/error?status=unauthorized');
    }

    const account = await db.account.findFirst({
      where: {
        userId: userId,
      },
      include: {},
    });

    if (!account) {
      return redirect('/course/error?status=unauthorized');
    }

    //UPDATE ACCOUNT

    await db.account.update({
      where: {
        id: account.id,
      },
      data: {
        firstName: onboarding.firstName,
        lastName: onboarding.lastName,
      },
    });

    const child = await db.child.upsert({
      where: { accountId: account.id }, // relies on unique(accountId)
      update: {
        name: onboarding.name,
        birthday: new Date(onboarding.birthday), // pass a Date
        profilePicture: onboarding.avatar,
        parentConsent: onboarding.parentConsent,
        notifications: onboarding.notify,
      },
      create: {
        name: onboarding.name,
        birthday: new Date(onboarding.birthday),
        profilePicture: onboarding.avatar,
        parentConsent: onboarding.parentConsent,
        notifications: onboarding.notify,
        account: { connect: { id: account.id } },
      },
    });

    const purchaseId = baseUrl.split('/').pop();

    //check if purchase has already childId
    const purchase = await db.purchase.findFirst({
      where: {
        id: purchaseId,
      },
    });

    if (!purchase?.childId) {
      await db.purchase.update({
        where: {
          id: baseUrl.split('/').pop(),
        },
        data: {
          childId: child.id,
        },
      });

      //Update MailerList - only update newsletter and notify preferences
      if (account.email) {
        await MailerList({
          email: account.email,
          firstName: onboarding.firstName || '',
          lastName: onboarding.lastName || '',
          newsletterGroup: onboarding.newsletter || false,
          notify: onboarding.notify || false,
          // Omit tier groups and memberType - preserves existing values
        });
      }
    } else {
      logger.error('[ONBOARDING] [REVIEW] Already enrolled a child on purchase');
    }
  } catch (error) {
    logger.error('[ONBOARDING] [REVIEW] Error updating purchase with child id', error);

    return {
      redirect: OnBoardingRoutes.REVIEW,
      errorMsg: 'Error Update error',
    };
  }

  // Update purchase with child id

  const retVal = { success: true, redirect: OnBoardingRoutes.COMPLETED };
  return retVal;
};
