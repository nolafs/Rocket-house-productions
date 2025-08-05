import React from 'react';
import dynamic from 'next/dynamic';
import { BASE_URL } from '../_component/path-types';
import { db } from '@rocket-house-productions/integration';
import { createClient } from '@/prismicio';
import StepOneForm from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/step-one/_components/step-one-form';

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

  return <div suppressHydrationWarning>test</div>;
}
