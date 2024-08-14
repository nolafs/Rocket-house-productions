import React from 'react';
import StepOneForm from './_components/step-one-form';
import { BASE_URL } from '../_component/path-types';
import { db } from '@rocket-house-productions/integration';
import { createClient } from '@/prismicio';

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

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

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
        header={data.onboarding_step_one_header}
        body={data?.onboarding_step_one_body}
      />
    </div>
  );
}
