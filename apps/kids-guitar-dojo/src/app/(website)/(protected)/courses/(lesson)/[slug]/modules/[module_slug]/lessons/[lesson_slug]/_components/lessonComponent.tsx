'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import { LessonContent } from '@rocket-house-productions/lesson/server';
import { LessonNext, LessonVideo } from '@rocket-house-productions/lesson';

interface LessonComponentProps {
  data: { course: any; module: any; lesson: any };
  child: any;
  page: any | null;
}

export function LessonComponent({ data, child, page }: LessonComponentProps) {
  return (
    <>
      <LessonVideo lesson={data.lesson} module={data.module as SectionModule} child={child} />

      <LessonContent
        title={data.lesson.title}
        page={page}
        description={data.lesson.description}
        position={data.lesson.position}
        category={data.lesson?.category?.name}
      />
      <LessonNext
        lesson={data.lesson as SectionLesson}
        module={data.module as SectionModule}
        course={data.course as SectionCourse}
      />
    </>
  );
}

export default LessonComponent;