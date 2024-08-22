'use server';
import { db } from '@rocket-house-productions/integration';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import getAccount from './get-account';

interface GetQuizProps {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export const getQuiz = async ({ courseSlug, moduleSlug, lessonSlug }: GetQuizProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const account = await getAccount(userId);

  if (!account) {
    throw new Error('User not found');
  }

  const course = await db.course.findUnique({
    where: {
      slug: courseSlug,
    },
  });

  if (!course) {
    throw new Error('Course not found');
  }

  const module = await db.module.findUnique({
    where: {
      slug: moduleSlug,
      courseId: course.id,
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      color: true,
      slug: true,
      isPublished: true,
      lessons: {
        where: {
          isPublished: true,
          slug: lessonSlug,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
          questionaries: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: 'asc',
            },
            include: {
              questions: {
                where: {
                  isPublished: true,
                },
                orderBy: {
                  position: 'asc',
                },
              },
            },
          },
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!module) {
    throw new Error('Module not found');
  }

  return {
    course: {
      id: course.id,
      slug: course.slug,
      title: course.title,
      isPublished: course.isPublished,
    },
    module: {
      id: module.id,
      color: module.color,
      title: module.title,
      slug: module.slug,
      isPublished: module.isPublished,
      lessons: module.lessons,
    },
    lesson: {
      id: module.lessons[0].id,
      title: module.lessons[0].title,
      slug: module.lessons[0].slug,
      position: module.lessons[0].position,
      isPublished: module.lessons[0].isPublished,
    },
    questionaries: module.lessons[0].questionaries,
  };
};
