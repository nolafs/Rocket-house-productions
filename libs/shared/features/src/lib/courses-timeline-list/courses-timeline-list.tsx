import { Prisma } from '@prisma/client';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image from 'next/image';
import Ribben from '../assets/header.png';
import CourseCard from './course-card';

export type CoursePayload = Prisma.CourseGetPayload<{
  include: {
    modules: true; // Module[]
  };
}>;

interface CourseTimelineProps {
  courses: CoursePayload[];
}

export function CoursesTimelineList({ courses }: CourseTimelineProps) {
  return (
    <div>
      <h1 className={'font-lesson-heading relative mb-5 text-2xl font-bold'}>
        <div>
          <Image src={Ribben} alt="Ribben" className="w-full" />
        </div>
        <div className={'absolute top-4 flex w-full flex-col py-1 text-center text-white'}>
          <span>Welcome</span>
          <span>Kid's guitar dojo</span>
        </div>
      </h1>
      <div className={'relative isolate w-full'}>
        <div className={'absolute left-0 top-0 z-0 h-full w-1/2 border-r-4 border-dashed border-black'}></div>
        <ul className={'z-2 relative flex flex-col items-center justify-center space-y-10'}>
          {courses.map((course, idx) => (
            <li key={'book' + idx} className={'flex w-full justify-center py-10'}>
              <CourseCard course={course} idx={idx} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CoursesTimelineList;
