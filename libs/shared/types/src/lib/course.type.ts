import type { Prisma } from '@prisma/client';

export type CourseModules = Prisma.CourseGetPayload<{
  include: {
    modules: true; // Module[]
  };
}>;
