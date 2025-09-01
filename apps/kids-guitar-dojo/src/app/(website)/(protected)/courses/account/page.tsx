import { LessonPageWrapper } from '@rocket-house-productions/lesson/server';
import { UserProfile } from '@clerk/nextjs';
import Image from 'next/image';
import Ribben from '@/assets/header.png';

export default function Page() {
  return (
    <LessonPageWrapper>
      <h1 className={'font-lesson-heading relative mb-5 text-2xl font-bold'}>
        <div>
          <Image src={Ribben} alt="Ribben" className="w-full" />
        </div>
        <div className={'absolute top-4 flex w-full flex-col py-1 text-center text-white'}>
          <span>Account</span>
          <span>Parents</span>
        </div>
      </h1>
      <UserProfile />
    </LessonPageWrapper>
  );
}
