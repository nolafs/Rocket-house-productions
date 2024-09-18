import { Lesson, Module } from '@prisma/client';

export type LessonType = Lesson & { category: { name: string } };
export type ModuleSection = Module & { lessons: LessonType[] };

export type LessonButton = {
  num: number;
  id: string;
  name: string;
  slug: string;
  moduleSlug: string;
  color: string;
  type: string;
};
