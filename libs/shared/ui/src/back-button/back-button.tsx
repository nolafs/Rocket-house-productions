'use client';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { ChevronLeftIcon } from 'lucide-react';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  return (
    <Button onClick={router.back} variant="default" size="lg">
      <i>
        <ChevronLeftIcon className={'h-6 w-6'} />
      </i>
      Back <span className={'sr-only'}>to previous page</span>
    </Button>
  );
}

export default BackButton;
