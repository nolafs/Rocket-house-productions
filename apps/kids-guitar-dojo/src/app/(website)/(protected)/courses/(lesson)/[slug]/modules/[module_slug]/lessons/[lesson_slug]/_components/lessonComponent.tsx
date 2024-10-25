'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import { LessonContent } from '@rocket-house-productions/lesson/server';
import { LessonBookCta, LessonNext, LessonVideo } from '@rocket-house-productions/lesson';

interface LessonComponentProps {
  data: { course: any; module: any; lesson: any };
  child: any;
  page: any | null;
}

export function LessonComponent({ data, child, page }: LessonComponentProps) {
  if (typeof window !== 'undefined') {
    console.log('Window is defined here');
  } else {
    console.log('Window is undefined here');
  }

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

      <LessonBookCta
        course={data.course as SectionCourse}
        bookCta={data.lesson.bookCta}
        bookMessage={data.lesson.bookMessage}
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
