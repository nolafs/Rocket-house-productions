'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';

interface GetCourseProps {
  courseSlug: string;
}

export const getCourse = async ({ courseSlug }: GetCourseProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findFirst({
    where: {
      slug: courseSlug,
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
          availableAwards: {
            include: {
              awardType: {
                select: {
                  name: true,
                  points: true,
                  badgeUrl: true,
                  condition: true,
                },
              },
            },
          },
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
    //cacheStrategy: { ttl: 600 },
  });

  if (!course) {
    return redirect('/');
  }

  return course;
};
