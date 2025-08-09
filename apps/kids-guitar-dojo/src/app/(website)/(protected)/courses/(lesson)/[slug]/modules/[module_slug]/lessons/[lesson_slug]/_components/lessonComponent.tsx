'use client';
import { SectionCourse, SectionLesson, SectionModule } from '@rocket-house-productions/types';
import { LessonBookCta, LessonNext } from '@rocket-house-productions/lesson';
import { useEffect } from 'react';

import dynamic from 'next/dynamic';

const LessonContent = dynamic(() => import('@rocket-house-productions/lesson').then(mod => mod.LessonContent), {
  ssr: false,
});

const LessonVideo = dynamic(() => import('@rocket-house-productions/lesson').then(mod => mod.LessonVideo), {
  ssr: false,
});

interface LessonComponentProps {
  data: { course: any; module: any; lesson: any };
  child: any;
  page: any | null;
}

export function LessonComponent({ data, child, page }: LessonComponentProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.info('Window is defined here');
    } else {
      console.warn('Window is undefined here');
    }
  }, []);

  return (
    <>
      <LessonVideo lesson={data.lesson} module={data.module as SectionModule} child={child} />

      <LessonContent
        title={data.lesson.title}
        moduleTitle={data.module.title}
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
