import { LessonPageWrapper } from '@rocket-house-productions/lesson';

import { PinInputWrapper } from './_components/PinInputWrapper';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';
import { logger } from '@rocket-house-productions/util';

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  // query string for pin
  const query = await searchParams;

  logger.debug('pin page query', { returnTo: query.returnTo });

  return (
    <LessonPageWrapper>
      <DialogReturnUrl title={'Enter Parent PIN'}>
        <div className={'flex w-full flex-col items-center justify-center px-4 py-8'}>
          <PinInputWrapper returnUrl={query.returnTo ?? '/'} />
        </div>
      </DialogReturnUrl>
    </LessonPageWrapper>
  );
}
