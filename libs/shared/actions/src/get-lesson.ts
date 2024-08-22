'use server';
import { db } from '@rocket-house-productions/integration';
import getAccount from './get-account';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

interface GetLessonProps {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export const getLesson = async ({ courseSlug, moduleSlug, lessonSlug }: GetLessonProps) => {
  try {
    const { userId } = auth();

    if (!userId) {
      redirect('/');
    }

    const account = await getAccount(userId);

    if (!account) {
      throw new Error('Account not found');
    }

    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
      },
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const purchase = await db.purchase.findUnique({
      where: {
        accountId_courseId_childId: {
          accountId: account.id,
          courseId: course.id,
          childId: account.children[0].id,
        },
      },
    });

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    const module = await db.module.findUnique({
      where: {
        slug: moduleSlug,
        courseId: course.id,
      },
      select: {
        id: true,
        title: true,
        color: true,
        slug: true,
        lessons: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            title: true,
            slug: true,
            isPublished: true,
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
          select: {
            id: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const childProgress = await db.childProgress.findUnique({
      where: {
        childId_lessonId: {
          childId: account.children[0].id,
          lessonId: lesson.id,
        },
      },
    });

    return {
      course,
      lesson,
      module,
      childProgress,
    };
  } catch (error) {
    console.error('Error getting lesson', error);
    return null;
  }
};

export default getLesson;
