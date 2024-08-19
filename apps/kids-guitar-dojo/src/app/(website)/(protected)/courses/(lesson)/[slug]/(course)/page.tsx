import { db } from '@rocket-house-productions/integration';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

interface PageProps {
  params: { slug: string };
}

export default async function Page({ params }: PageProps) {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findFirst({
    where: {
      slug: params.slug,
      isPublished: true,
    },
    include: {
      modules: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
        include: {
          lessons: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  return (
    <div className={'fex-col flex items-center justify-center'}>
      <div className={'flex flex-col space-y-6'}>
        <h1 className={'text-primary text-5xl font-bold'}>Course: {course.title}</h1>

        <ul className={'space-y-3 text-lg'}>
          {course.modules.map((module, idx) => (
            <li key={module.id}>
              <h2>
                {idx + 1} {module.title}
              </h2>
              <ul className={'ml-10 text-sm'}>
                {module.lessons.map((lesson, idx) => (
                  <li key={lesson.id}>
                    <Link
                      className={cn(buttonVariants({ variant: 'ghost' }))}
                      href={`/courses/${course.slug}/modules/${module.slug}/lessons/${lesson.slug}`}>
                      Lesson {idx + 1}: {lesson.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
