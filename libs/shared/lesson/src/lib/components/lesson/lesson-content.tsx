'use server';

import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { SliceZone } from '@prismicio/react';
interface LessonContentProps {
  title?: string | null | undefined;
  no?: number;
  page?: any;
  description?: string | null | undefined;
}

export async function LessonContent({ title, page, description, no = 0 }: LessonContentProps) {
  let subtitle = '';

  if (page) {
    title = page.data.title;
    subtitle = page.data.subtitle;
  } else {
    subtitle = `Lesson ${no + 1}`;
  }

  return (
    <>
      <h1 className={'heading flex flex-col pt-10 font-bold'}>
        <small className={'text-pink-500 lg:text-xl'}>{subtitle}</small>
        <span className={'text-2xl lg:text-4xl'}>{title}</span>
      </h1>
      <div className={'prose prose-sm md:prose-md lg:prose-lg max-w-5xl'}>
        {description && <div dangerouslySetInnerHTML={{ __html: description }}></div>}
        {page && <SliceZone slices={page.data.slices} components={components} />}
      </div>
    </>
  );
}

export default LessonContent;
