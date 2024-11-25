import React from 'react';
import StepTwoForm from './_components/step-two-form';
import { BASE_URL } from '../_component/path-types';
import { createClient } from '@/prismicio';

export default async function StepTwo({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}${params.purchaseId}`;

  const client = createClient();
  const { data } = await client.getSingle('onboarding');

  return (
    <StepTwoForm baseUrl={baseUrl} header={data.onboarding_step_two_header} body={data?.onboarding_step_two_body} />
  );
}
