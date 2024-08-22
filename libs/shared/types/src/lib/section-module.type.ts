export type SectionCourse = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
};

export type SectionModule = {
  id?: string;
  title?: string;
  slug?: string;
  color?: string;
  lessons?: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
  }[];
};

export type SectionLesson = {
  categoryId: string;
  description: string | null;
  id: string;
  isFree: boolean;
  isPublished: boolean;
  moduleId: string;
  position: number;
  prismaSlug: string;
  questionaries: any[]; // Replace `any` with a specific type if you know the structure of the items in the array
  slug: string;
  title: string;
  videoId: string;
  videoLibId: string;
};
