'use server';
import { db } from '@rocket-house-productions/integration';
import getAccount from './get-account';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import getAccountChildren from './get-account-children';

interface GetLessonProps {
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export const getLesson = async ({ courseSlug, moduleSlug, lessonSlug }: GetLessonProps) => {
  try {
    const startUserId = Date.now();
    const { userId } = auth();
    console.log('Time taken for Userid:', Date.now() - startUserId, 'ms');
    if (!userId) {
      redirect('/');
    }

    const startAccount = Date.now();
    const account = await getAccountChildren(userId);
    console.log('Time taken for getAccount:', Date.now() - startAccount, 'ms');

    if (!account) {
      throw new Error('Account not found');
    }

    const startCourse = Date.now();
    const course = await db.course.findUnique({
      where: {
        slug: courseSlug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        isPublished: true,
      },
      cacheStrategy: { ttl: 60 },
    });
    console.log('Time taken for db.course.findUnique:', Date.now() - startCourse, 'ms');

    if (!course) {
      throw new Error('Course not found');
    }

    const startPurchase = Date.now();
    const purchase = await db.purchase.findUnique({
      where: {
        accountId_courseId_childId: {
          accountId: account.id,
          courseId: course.id,
          childId: account.children[0].id,
        },
      },
      cacheStrategy: { ttl: 60 },
    });
    console.log('Time taken for db.purchase.findUnique:', Date.now() - startPurchase, 'ms');

    if (!purchase) {
      throw new Error('Purchase not found');
    }

    const startModule = Date.now();
    const module = await db.module.findUnique({
      where: {
        courseId_slug: {
          courseId: course.id,
          slug: moduleSlug,
        },
      },
      select: {
        id: true,
        title: true,
        color: true,
        slug: true,
        availableAwards: {
          select: {
            id: true,
            moduleId: true,
            awardType: {
              select: {
                id: true,
                name: true,
                points: true,
                description: true,
                badgeUrl: true,
                condition: true,
              },
            },
          },
        },
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
      cacheStrategy: { ttl: 60 },
    });
    console.log('Time taken for db.module.findUnique:', Date.now() - startModule, 'ms');

    if (!module) {
      throw new Error('Module not found');
    }

    const startLesson = Date.now();
    const lesson = await db.lesson.findUnique({
      where: {
        slug_moduleId_isPublished: {
          slug: lessonSlug,
          moduleId: module.id,
          isPublished: true,
        },
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        questionaries: {
          select: {
            id: true,
          },
        },
      },
      cacheStrategy: { ttl: 60 },
    });
    console.log('Time taken for db.lesson.findUnique:', Date.now() - startLesson, 'ms');

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const startChildProgress = Date.now();
    const childProgress = await db.childProgress.findUnique({
      where: {
        childId_lessonId: {
          childId: account.children[0].id,
          lessonId: lesson.id,
        },
      },
    });
    console.log('Time taken for db.childProgress.findUnique:', Date.now() - startChildProgress, 'ms');

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
