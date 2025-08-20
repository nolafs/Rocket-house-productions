'use client';

import { useModuleProgressStore } from '@rocket-house-productions/providers';

export default function ModuleWrapper({ children }: { children: React.ReactNode }) {
  const { getCurrentModule } = useModuleProgressStore(store => store);

  return (
    <div className={'lesson min-h-screen w-full'} style={{ backgroundColor: getCurrentModule()?.color || '#e8c996' }}>
      {children}
    </div>
  );
}
