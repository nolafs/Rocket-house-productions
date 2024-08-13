import React from 'react';
import StepThreeForm from './_components/step-three-form';
import { BASE_URL } from '../_component/path-types';

export default function StepTwo({ params }: { params: { purchaseId: string } }) {
  const baseUrl = `${BASE_URL}/${params.purchaseId}`;
  return (
    <div>
      <StepThreeForm baseUrl={baseUrl} />
    </div>
  );
}
