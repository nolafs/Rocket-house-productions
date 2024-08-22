import { db } from '@rocket-house-productions/integration';
import { notFound, redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import CourseDebugNavigation from './_component/course-debug-navigation';
import { LessonCourseProgression } from '@rocket-house-productions/lesson';

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
      attachments: {
        include: {
          attachmentType: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      modules: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: 'asc',
        },
        include: {
          attachments: {
            include: {
              attachmentType: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          lessons: {
            where: {
              isPublished: true,
            },
            include: {
              category: {
                select: {
                  name: true,
                },
              },
              questionaries: true,
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
    <>
      <CourseDebugNavigation course={course} />
      <LessonCourseProgression />
    </>
  );
}
