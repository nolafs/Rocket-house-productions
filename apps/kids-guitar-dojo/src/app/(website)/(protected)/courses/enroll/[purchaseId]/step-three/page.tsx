import React from 'react';
import StepThreeForm from './_components/step-three-form';
import { BASE_URL } from '../_component/path-types';
import { createClient } from '@/prismicio';

export default async function StepTwo({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  return (
    <div>
      <StepThreeForm
        baseUrl={baseUrl}
        header={data.onboarding_step_three_header}
        body={data?.onboarding_step_three_body}
      />
    </div>
  );
}
