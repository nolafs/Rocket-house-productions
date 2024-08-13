import React from 'react';
import StepOneForm from './_components/step-one-form';
import { BASE_URL } from '../_component/path-types';
import { db } from '@rocket-house-productions/integration';

export default async function StepTwo({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}${params.purchaseId}`;

  //Get Purchase by id and account

  const purchase = await db.purchase.findFirst({
    where: {
      id: params.purchaseId,
    },
    include: {
      account: true,
    },
  });

  console.log('purchase', purchase);

  return (
    <div>
      <StepOneForm
        baseUrl={baseUrl}
        purchase={{
          id: purchase?.id,
          account: {
            id: purchase?.account.id,
            firstName: purchase?.account.firstName,
            lastName: purchase?.account.lastName,
            email: purchase?.account.email,
          },
        }}
      />
    </div>
  );
}
