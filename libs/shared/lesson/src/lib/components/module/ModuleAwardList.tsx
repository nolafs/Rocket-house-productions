import { useModuleProgressStore } from '@rocket-house-productions/providers';
import { useEffect, useState } from 'react';
import { AvailableAward } from '@rocket-house-productions/store';

export function ModuleAwardList() {
  const [awards, setAwards] = useState<AvailableAward[]>([]);
  const getAwards = useModuleProgressStore(state => state.getAwards);

  useEffect(() => {
    setAwards(getAwards());
  }, [getAwards]);

  if (!awards.length) {
    return <div className={'py-2'}>No awards received yet</div>;
  }

  return (
    <div className={'mt-2 flex flex-wrap items-center gap-3 text-center'}>
      {awards.map(award => (
        <div key={award.id}>
          {award?.awardType.badgeUrl && <img src={award?.awardType.badgeUrl} alt={'badge'} width={80} height={80} />}
        </div>
      ))}
    </div>
  );
}

export default ModuleAwardList;
