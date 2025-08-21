import { Loader2 } from 'lucide-react';
import { getCourses } from '@rocket-house-productions/actions/server';
import Link from 'next/link';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

export default async function Page() {
  // get all courses
  const courses = await getCourses();

  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <h1 className={'font-lesson-heading mb-5 text-2xl font-bold'}>Course list</h1>
      <ul className={'flex flex-col items-center justify-center space-y-4'}>
        {courses.map(course => (
          <li key={course.slug}>
            <Link className={buttonVariants()} href={`/courses/${course.slug}`}>
              {course.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
