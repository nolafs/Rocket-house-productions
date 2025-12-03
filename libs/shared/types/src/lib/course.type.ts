import { Prisma, Purchase } from '@prisma/client';

export type CourseModules = Prisma.CourseGetPayload<{
  include: {
    modules: true; // Module[]
  };
}>;

export type PurchaseCourse = Purchase & {
  course: {
    id: string;
    slug: string | null;
  };
};
