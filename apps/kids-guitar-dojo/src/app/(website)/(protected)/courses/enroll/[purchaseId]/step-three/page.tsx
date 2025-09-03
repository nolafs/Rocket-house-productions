import React from 'react';
import StepThreeForm from './_components/step-three-form';
import { BASE_URL } from '../_component/path-types';
import { createClient } from '@/prismicio';
import StepThreeWrapper from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/step-three/_components/StepThreeWrapper';

export default async function Page(props: { params: Promise<{ purchaseId: string }> }) {
  const params = await props.params;
  const baseUrl = `${BASE_URL}${params.purchaseId}`;

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  return (
    <div suppressHydrationWarning>
      <StepThreeWrapper
        baseUrl={baseUrl}
        header={data.onboarding_step_three_header}
        body={data?.onboarding_step_three_body}
      />
    </div>
  );
}
