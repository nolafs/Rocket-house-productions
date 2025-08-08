'use client';
import dynamic from 'next/dynamic';
import { StepThreeFormProps } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/step-three/_components/step-three-form';

const StepThreeForm = dynamic(() => import('./step-three-form'), { ssr: false });

export function StepThreeWrapper(props: StepThreeFormProps) {
  return <StepThreeForm {...props} />;
}

export default StepThreeWrapper;
