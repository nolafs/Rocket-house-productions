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
  const { userId } = await auth();

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
        },
        select: {
          id: true,
          title: true,
          slug: true,
          isPublished: true,
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

  const lesson = await db.lesson.findUnique({
    where: {
      slug: lessonSlug,
      moduleId: module.id,
      isPublished: true,
    },
    include: {
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
    },
  });

  if (!lesson) {
    throw new Error('Lesson not found');
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
      id: lesson.id,
      title: lesson.title,
      slug: lesson.slug,
      position: lesson.position,
      isPublished: lesson.isPublished,
    },
    questionaries: lesson?.questionaries || null,
  };
};
