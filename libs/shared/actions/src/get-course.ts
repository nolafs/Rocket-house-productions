'use server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@rocket-house-productions/integration/server';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';

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

export const getCourse = async ({ courseSlug }: GetCourseProps): Promise<CourseWithRelations | never> => {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/');
  }

  const course = (await db.course.findFirst({
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
    //cacheStrategy: { ttl: 600 },
  })) as CourseWithRelations | null;

  if (!course) {
    return redirect('/');
  }

  return course;
};
