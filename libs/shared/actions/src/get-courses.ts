'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';
export const getCourses = async () => {
  const { userId, sessionClaims } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const isAdmin = (sessionClaims?.metadata as { role: string })?.role === 'admin';

  const courses = await db.course.findMany({
    ...(isAdmin ? {} : { where: { isPublished: true } }),
    orderBy: {
      order: 'asc',
    },
    include: {
      tiers: {
        orderBy: { position: 'asc' },
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
      modules: {
        ...(isAdmin ? {} : { where: { isPublished: true } }),
        orderBy: {
          position: 'asc',
        },
        include: {
          lessons: {
            ...(isAdmin ? {} : { where: { isPublished: true } }),
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: {
              position: 'asc',
            },
          },
        },
      },
    },
  });

  if (!courses) {
    return redirect('/');
  }

  return courses;
};
