'use client';
import path from 'path';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import cn from 'classnames';
import { STEPS } from './path-types';
import { useMenuActive } from '@/app/(website)/(protected)/courses/enroll/[purchaseId]/_component/useMenuActive';
const steps = STEPS;

interface StepNavigationProps {
  baseUrl: string;
}

export default function StepNavigation({ baseUrl }: StepNavigationProps) {
  const pathname = usePathname();
  const currentPath = path.basename(pathname);
  const [currentStep, setCurrentStep] = useState(1);
  const active = useMenuActive(state => state.active);

  useEffect(() => {
    setCurrentStep(steps.findIndex(step => step.route === currentPath));
  }, [currentPath]);

  return (
    <div
      className={cn(
        'bg-lesson-background mb-12 mt-4 min-w-60 rounded-full px-3 py-5 transition ease-in-out lg:mb-0',
        active ? 'opacity-100' : 'opacity-0',
      )}>
      {/* list of form steps */}
      <div className="relative flex flex-row justify-between gap-x-5 md:gap-x-20">
        {steps.map((step, i) => (
          <Link
            href={`${baseUrl}${step.link}`}
            key={step.link}
            className="group z-20 flex items-center gap-3 text-2xl"
            prefetch={true}>
            <span
              className={cn(
                'font-(lessons)-heading flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors duration-200 lg:h-12 lg:w-12 lg:text-lg',
                {
                  'bg-primary border-white font-bold text-white group-hover:border-none group-hover:text-white/75':
                    currentPath === step.route,
                  'border-pink-100/75 bg-pink-500 text-white/75 group-hover:border-pink-300 group-hover:text-white':
                    currentPath !== step.route,
                },
              )}>
              {i + 1}
            </span>
            <span className="sr-only">{step.title}</span>
          </Link>
        ))}
        <div className="absolute top-1/2 flex h-1 w-full -translate-y-1/2 border-b border-dashed" />
      </div>
    </div>
  );
}
