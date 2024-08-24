'use client';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useModuleProgressStore } from '@rocket-house-productions/providers';

export const Loading = () => {
  const { getCurrentModule } = useModuleProgressStore(store => store);

  return (
    <div
      className={'flex h-svh w-full flex-col items-center justify-center bg-amber-600'}
      style={{ backgroundColor: getCurrentModule()?.color || '#e8c996' }}>
      <Loader2 className={'h-12 w-12 animate-spin text-white'} />
    </div>
  );
};

export default Loading;
