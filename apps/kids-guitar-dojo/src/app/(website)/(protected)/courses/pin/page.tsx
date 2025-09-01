import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import Image from 'next/image';
import Ribben from '@/assets/header.png';

import { PinInputWrapper } from './_components/PinInputWrapper';

type PageProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  // query string for pin
  const query = await searchParams;

  return (
    <LessonPageWrapper>
      <h1 className={'font-lesson-heading relative mb-5 text-2xl font-bold'}>
        <div>
          <Image src={Ribben} alt="Ribben" className="w-full" />
        </div>
        <div className={'absolute top-4 flex w-full flex-col py-1 text-center text-white'}>
          <span>Parent Lock</span>
          <span>Enter Pin</span>
        </div>
      </h1>

      <PinInputWrapper returnUrl={query.returnTo ?? '/'} />
    </LessonPageWrapper>
  );
}
