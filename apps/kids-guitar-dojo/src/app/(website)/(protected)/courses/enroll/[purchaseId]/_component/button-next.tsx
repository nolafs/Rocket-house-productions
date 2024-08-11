'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import path from 'path';
import { STEPS } from './path-types';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

interface NextButtonProps {
  label?: string;
  baseUrl?: string;
}

const steps = STEPS;

export const NextButton = ({ label = 'next', baseUrl = '/' }: NextButtonProps) => {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    setCurrentStep(steps.findIndex(step => step.route === currentPath));
  }, [currentPath]);

  return (
    <Link
      className={cn(buttonVariants({ variant: 'lesson', size: 'lg' }))}
      href={baseUrl + steps[currentStep + 1]?.link || steps[steps.length - 1].link}>
      {label}
    </Link>
  );
};

export default NextButton;
