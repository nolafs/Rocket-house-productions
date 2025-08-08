'use client';
import { ReactNode } from 'react';
import { cn } from '@rocket-house-productions/util';

interface DialogLayoutProps {
  title: string;
  children: ReactNode;
  classNames?: string;
}
export function DialogLayout({ title, children, classNames }: DialogLayoutProps) {
  return (
    <div className="relative pb-3 text-center">
      <div className={'absolute h-full w-full overflow-hidden rounded-xl bg-gray-100'} />
      <div
        className={
          'bg-lessons z-2 text-lessons-foreground relative flex h-full w-full flex-col rounded-xl md:min-h-[484px] lg:min-w-[750px] lg:max-w-[800px]'
        }>
        <header
          className={
            'text-shadow font-lesson-heading bg-dialog-lesson relative flex h-[100px] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-t-xl bg-pink-500 bg-repeat sm:rounded-t-xl'
          }>
          <h2 className="text-center text-xl font-semibold leading-none tracking-tight text-white md:text-2xl lg:text-3xl">
            {title}
          </h2>
        </header>
        <div
          className={cn(
            'content flex h-full w-full flex-1 flex-col justify-stretch rounded-b-lg bg-white px-6 pb-5 pt-7 md:px-10',
            classNames,
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DialogLayout;
