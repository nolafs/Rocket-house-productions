'use client';
import dynamic from 'next/dynamic';
import { StepTwoFormProps } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/step-two/_components/step-two-form';

const StepTwoForm = dynamic(() => import('./step-two-form'), { ssr: false });

export function StepTwoWrapper(props: StepTwoFormProps) {
  return <StepTwoForm {...props} />;
}

export default StepTwoWrapper;
