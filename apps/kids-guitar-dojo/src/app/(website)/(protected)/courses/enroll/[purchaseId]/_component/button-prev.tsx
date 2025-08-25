'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import path from 'path';
import Link from 'next/link';
import { STEPS } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/path-types';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
interface PrevButtonProps {
  label?: string;
  baseUrl?: string;
}

const steps = STEPS;

export const PrevButton = ({ label = 'Previous', baseUrl = '/' }: PrevButtonProps) => {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setCurrentStep(steps.findIndex(step => step.route === currentPath));
  }, [currentPath]);

  return (
    <Link
      href={baseUrl + steps[currentStep - 1]?.link || steps[0].link}
      className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }))}>
      {label}
    </Link>
  );
};

export default PrevButton;
