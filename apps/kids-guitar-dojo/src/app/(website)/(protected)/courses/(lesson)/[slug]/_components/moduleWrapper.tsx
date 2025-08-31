'use client';

import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';

export default function ModuleWrapper({ children }: { children: React.ReactNode }) {
  const { getCurrentModule } = useModuleProgressStore(store => store);

  return (
    <LessonPageWrapper className={'p-0'}>
      <div className={'min-h-screen w-full'} style={{ backgroundColor: getCurrentModule()?.color || 'transparent' }}>
        {children}
      </div>
    </LessonPageWrapper>
  );
}
