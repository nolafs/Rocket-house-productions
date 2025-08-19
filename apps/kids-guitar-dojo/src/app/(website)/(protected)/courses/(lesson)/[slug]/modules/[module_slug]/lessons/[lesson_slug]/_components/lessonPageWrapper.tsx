'use client';
import { ScrollToProvider } from '@rocket-house-productions/providers';
import React, { ReactNode } from 'react';

export default function LessonPageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className={'min-h-screen bg-white'}>
      <ScrollToProvider>{children}</ScrollToProvider>
    </div>
  );
}
