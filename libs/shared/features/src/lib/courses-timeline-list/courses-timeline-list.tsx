import { MembershipSettings, Prisma, Tier } from '@prisma/client';
import Image from 'next/image';
import Ribben from '../assets/header.png';
import CourseCard from './course-card';
import { userSession } from '@/types/userSesssion';

export type CoursePayload = Prisma.CourseGetPayload<{
  include: {
    modules: true;
    tiers: true;
  };
}>;

interface CourseTimelineProps {
  courses: CoursePayload[];
  userData: Partial<userSession>;
  membershipData: Partial<MembershipSettings> & { course: { tiers: Tier[] } }; // corrected property name
}

export function CoursesTimelineList({ courses, membershipData, userData }: CourseTimelineProps) {
  return (
    <div>
      <h1 className={'font-lesson-heading relative mb-4 text-lg font-bold md:mb-5 md:text-2xl'}>
        <div>
          <Image src={Ribben} alt="Ribben" className="w-full" />
        </div>
        <div className={'absolute top-2 flex w-full flex-col py-1 text-center text-white md:top-4'}>
          <span>Welcome</span>
          <span>Kid's guitar dojo</span>
        </div>
      </h1>
      <div className={'relative isolate w-full px-5'}>
        <div className={'absolute left-0 top-0 z-0 h-full w-1/2 border-r-4 border-dashed border-black'}></div>
        <ul className={'z-2 relative flex flex-col items-center justify-center space-y-10'}>
          {courses.map((course, idx) => (
            <li key={'book' + idx} className={'flex w-full justify-center py-10'}>
              <CourseCard course={course} idx={idx} userData={userData} membershipData={membershipData} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CoursesTimelineList;
