'use client';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle } from '../dialog-layout/dialog';
import ButtonDownloadPdf from '../button-download-pdf';
import { useEffect, useState } from 'react';
import { useModuleProgressStore, usePointsStore } from '@rocket-house-productions/providers';
import { AwardType, ModuleAwardType } from '@prisma/client';
import Image from 'next/image';
import { useConfettiStore } from '@rocket-house-productions/hooks';
import { ModuleAttachment } from '@rocket-house-productions/store';

type AvailableAward = ModuleAwardType & {
  id: string;
  awardType: AwardType;
  moduleId: string;
  awarded: boolean;
  awardNotified: boolean;
};

export function ModuleAwards() {
  const [open, setOpen] = useState(false);
  const { getModulesAwardNotification, modules, setAwardNotification, getAttachment } = useModuleProgressStore(
    store => store,
  );
  const [awards, setAwards] = useState<AvailableAward[]>([]);
  const [attachment, setAttachment] = useState<ModuleAttachment | null>(null);
  const { addPoints } = usePointsStore(store => store);
  const confetti = useConfettiStore();

  useEffect(() => {
    const awards = getModulesAwardNotification();

    if (awards.length) {
      awards.map(award => {
        if (!award.awardNotified) {
          const attachments = getAttachment(award.moduleId);
          const certs = attachments?.find(attachment => attachment.attachmentType.name === 'Certificate');

          if (certs) {
            setAttachment(certs);
          }

          console.log('[awards]', award, award.awardNotified);
          console.log('[awards] - cert', certs);

          setAwards(prevState => awards);

          addPoints(award.awardType.points);
          setAwardNotification(award.moduleId, award.id);
          confetti.onOpen();

          setOpen(true);
        }
      });
    }

    console.log('awards', awards);
  }, [modules]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Amazing Job!</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {awards.map(award => (
            <div key={award.id} className={'mt-2 flex flex-col items-center justify-center gap-y-3 text-center'}>
              <div>
                <h2 className={'font-lesson-heading mb-5 text-xl font-bold md:text-2xl lg:text-3xl'}>
                  {award?.awardType.description ? (
                    <span dangerouslySetInnerHTML={{ __html: award?.awardType.description }}></span>
                  ) : (
                    `You’ve earned your ${award?.awardType.name} badge!`
                  )}
                </h2>
              </div>
              <div>
                {award?.awardType.badgeUrl && (
                  <Image src={award?.awardType.badgeUrl} alt={'badge'} width={150} height={150} />
                )}
              </div>
              <div>
                <p>You scored {award.awardType.points} bonus points</p>
              </div>
              <div>
                {attachment && (
                  <ButtonDownloadPdf
                    url={attachment.url}
                    filename={attachment.name}
                    label={'Download your certificate!'}
                  />
                )}
              </div>
            </div>
          ))}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

export default ModuleAwards;
