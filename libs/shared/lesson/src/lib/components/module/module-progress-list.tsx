'use client';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useState } from 'react';
import { ModuleProgression } from '@rocket-house-productions/store';

export function ModuleProgressList() {
  const { getAllModules, getModuleProgress } = useModuleProgressStore(store => store);
  const [moduleList, setModuleList] = useState<ModuleProgression[]>([]);
  console.log('[ALL MODULE]', getAllModules());

  useEffect(() => {
    const modules = getAllModules();
    const list: ModuleProgression[] = [];
    // create an array of list of objects
    for (const module in modules) {
      const m = modules[module];
      list.push(m);
    }

    console.log('[MODULE LIST]', list);

    if (list.length > 0) {
      setModuleList(list);
    }
  }, [getAllModules]);

  return (
    <div className={'flex flex-col divide-y'}>
      {moduleList.map(module => {
        return (
          <div className={'flex flex-row justify-between py-3'}>
            <div>{module.title}</div>
            <div>{Math.round(module.progress)}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default ModuleProgressList;
