'use client';
import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useState } from 'react';
import { ModuleProgression } from '@rocket-house-productions/store';

export function ModuleProgressList() {
  const { getAllModules, modules } = useModuleProgressStore(store => store);
  const [moduleList, setModuleList] = useState<ModuleProgression[]>([]);

  useEffect(() => {
    const modules = getAllModules();
    const list: ModuleProgression[] = [];
    // create an array of list of objects
    for (const module in modules) {
      const m = modules[module];
      list.push(m);
    }

    if (list.length > 0) {
      setModuleList(list);
    }
  }, [getAllModules, modules]);

  return (
    <div className={'flex flex-col divide-y'}>
      {moduleList.map(module => {
        return (
          <div className={'flex flex-row justify-between py-3'}>
            <div className={'font-bold'} style={{ color: module.color }}>
              {module.title}
            </div>
            <div className={'font-extrabold'}>{Math.round(module.progress)}%</div>
          </div>
        );
      })}
    </div>
  );
}

export default ModuleProgressList;
