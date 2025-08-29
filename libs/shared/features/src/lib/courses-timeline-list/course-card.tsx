import { CoursePayload } from './courses-timeline-list';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui/server';
import Image from 'next/image';

interface CourseCardProps {
  course: CoursePayload;
  idx?: number;
}

export function CourseCard({ course, idx = 0 }: CourseCardProps) {
  return (
    <div
      className={
        'relative w-full max-w-sm rounded-xl border-2 border-[#e8c996] bg-[#f1dec0] p-4 shadow-sm shadow-black/20'
      }>
      <div className={'absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'}>
        <div
          className={
            'bg-secondary font-lesson-heading flex h-10 w-10 flex-col items-center justify-center rounded-full border-2 border-black'
          }>
          {idx + 1}
        </div>
      </div>
      <div className={'mt-5 flex flex-col items-center justify-center'}>
        <h1 className={'font-lesson-heading text-lg'}>{course.title}</h1>
        <Image
          src={course.imageUrl || '/images/course-placeholder.png'}
          alt={course.title}
          width={200}
          height={120}
          className={'w-full overflow-hidden rounded-lg p-2'}
        />
        <div>
          <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
            Enter Course
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
