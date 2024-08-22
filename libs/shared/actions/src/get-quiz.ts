import { db } from '@rocket-house-productions/integration';

interface GetQuizProps {
  userId: string;
  childId: string;
  courseSlug: string;
  moduleSlug: string;
  lessonSlug: string;
}

export const getQuiz = async ({ userId, courseSlug, moduleSlug, lessonSlug, childId }: GetQuizProps) => {
  const account = await db.account.findUnique({
    where: {
      userId: userId,
    },
    include: {
      children: true,
    },
  });

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
