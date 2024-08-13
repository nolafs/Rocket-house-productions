import React from 'react';
import StepTwoForm from './_components/step-two-form';
import { BASE_URL } from '../_component/path-types';

export default function StepTwo({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;
  return (
    <div>
      <StepTwoForm baseUrl={baseUrl} />
    </div>
  );
}
