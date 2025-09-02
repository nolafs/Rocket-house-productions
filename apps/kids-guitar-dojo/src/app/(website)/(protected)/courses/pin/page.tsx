import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';

import { PinInputWrapper } from './_components/PinInputWrapper';
import { DialogReturnUrl } from '@rocket-house-productions/lesson';

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  // query string for pin
  const query = await searchParams;

  console.log('query', query);

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
