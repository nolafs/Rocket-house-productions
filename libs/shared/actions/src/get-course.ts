'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { unstable_cache, revalidateTag } from 'next/cache';

interface GetCourseProps {
  courseSlug: string;
}

export type CourseWithRelations = Prisma.CourseGetPayload<{
  include: {
    tiers: true;
    bookScene: true;
    attachments: {
      include: {
        attachmentType: {
          select: {
            name: true;
          };
        };
      };
    };
    modules: {
      include: {
        availableAwards: {
          include: {
            awardType: {
              select: {
                name: true;
                points: true;
                badgeUrl: true;
                condition: true;
              };
            };
          };
        };
        attachments: {
          include: {
            attachmentType: {
              select: {
                name: true;
              };
            };
          };
        };
        lessons: {
          include: {
            category: {
              select: {
                name: true;
              };
            };
            questionaries: true;
          };
        };
      };
    };
  };
}>;

// Helper function to revalidate course cache
export async function revalidateCourse(courseSlug: string) {
  'use server';
  try {
    // Force type to any to avoid version mismatch issues
    (revalidateTag as any)(`course-${courseSlug}`);
  } catch (error) {
    console.error('Failed to revalidate course cache for:', courseSlug, error);
  }
}

export const getCourse = async ({ courseSlug }: GetCourseProps): Promise<CourseWithRelations | never> => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  // Use unstable_cache with long TTL since courses don't change often
  const getCachedCourseData = unstable_cache(
    async () => {
      return await db.course.findFirst({
        where: {
          slug: courseSlug,
          isPublished: true,
        },
        include: {
          tiers: {
            orderBy: { position: 'asc' },
          },
          bookScene: true,
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
      });
    },
    [`course-${courseSlug}`],
    {
      tags: [`course-${courseSlug}`],
      revalidate: 7200, // Cache for 2 hour since courses don't change often
    },
  );

  const course = (await getCachedCourseData()) as CourseWithRelations | null;

  if (!course) {
    return redirect('/');
  }

  return course;
};
