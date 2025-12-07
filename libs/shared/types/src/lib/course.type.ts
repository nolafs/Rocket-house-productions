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

export type CoursePayload = Prisma.CourseGetPayload<{
  include: {
    modules: true; // Module[]
    bookScene: true;
    tiers: true;
    membershipSettings: {
      include: {
        included: {
          include: { includedCourse: true };
        };
      };
    };
    attachments: {
      include: { attachmentType: true }; // Attachment & { attachmentType: AttachmentType }
    };
  };
}>;

export type CoursesPayload = Prisma.CourseGetPayload<{
  include: {
    tiers: true;
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
        lessons: {
          include: {
            category: {
              select: {
                name: true;
              };
            };
          };
        };
      };
    };
  };
}>;

export type ModuleWithLessons = Prisma.ModuleGetPayload<{
  select: {
    id: true;
    title: true;
    color: true;
    slug: true;
    isPublished: true;
    lessons: {
      select: {
        id: true;
        title: true;
        slug: true;
        isPublished: true;
        position: true;
      };
    };
  };
}>;

export type LessonWithQuestionaries = Prisma.LessonGetPayload<{
  include: {
    questionaries: {
      include: {
        questions: true;
      };
    };
  };
}>;
