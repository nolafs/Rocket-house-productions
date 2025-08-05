import React from 'react';
import dynamic from 'next/dynamic';
import { BASE_URL } from '../_component/path-types';
import { db } from '@rocket-house-productions/integration';
import { createClient } from '@/prismicio';

// Dynamically import with SSR disabled
const StepOneForm = dynamic(() => import('./_components/step-one-form'), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;
  const baseUrl = `${BASE_URL}${params.purchaseId}`;

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
