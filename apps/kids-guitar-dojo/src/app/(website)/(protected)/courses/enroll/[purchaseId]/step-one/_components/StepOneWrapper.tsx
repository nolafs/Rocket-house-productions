'use client';
import dynamic from 'next/dynamic';
import { StepOneFormProps } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/step-one/_components/step-one-form';
const StepOneForm = dynamic(() => import('./step-one-form'), { ssr: false });

export function StepOneWrapper(props: StepOneFormProps) {
  return <StepOneForm {...props}></StepOneForm>;
}

export default StepOneWrapper;
