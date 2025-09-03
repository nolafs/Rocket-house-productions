'use client';
import { ReactNode } from 'react';
import { cn } from '@rocket-house-productions/util';
import * as React from 'react';
import { useRouter } from 'next/navigation';

interface DialogLayoutProps {
  title: string;
  children: ReactNode;
  classNames?: string;
  hasCloseUrl?: string;
}
export function DialogLayout({ title, children, classNames, hasCloseUrl }: DialogLayoutProps) {
  const router = useRouter();

  return (
    <div className="relative pb-3 text-center">
      <div className={'absolute h-full w-full overflow-hidden rounded-xl bg-gray-100'} />
      <div
        className={
          'bg-lessons z-2 text-lessons-foreground relative flex h-full w-full flex-col rounded-xl md:min-h-[484px] lg:min-w-[750px] lg:max-w-[880px]'
        }>
        <header
          className={
            'text-shadow font-lesson-heading bg-dialog-lesson relative flex h-[100px] flex-col items-center justify-center space-y-1.5 overflow-hidden rounded-t-xl bg-pink-500 bg-repeat sm:rounded-t-xl'
          }>
          <h2 className="text-center text-xl font-semibold leading-none tracking-tight text-white md:text-2xl lg:text-3xl">
            {title}
          </h2>
          {hasCloseUrl && (
            <div
              className={'absolute right-5 top-6'}
              onClick={() => {
                router.back();
              }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="5" fill="white" />
                <path
                  d="M20.1177 17.9991L26.0594 12.0669L26.0596 12.0666C26.3416 11.7846 26.5 11.4022 26.5 11.0035C26.5 10.6047 26.3416 10.2223 26.0596 9.94036C25.7777 9.6584 25.3953 9.5 24.9965 9.5C24.5978 9.5 24.2154 9.6584 23.9334 9.94036L23.9331 9.94064L18.0009 15.8823L12.0686 9.94064L12.0683 9.94036C11.7863 9.6584 11.4039 9.5 11.0052 9.5C10.6064 9.5 10.224 9.6584 9.94206 9.94036C9.66011 10.2223 9.50171 10.6047 9.50171 11.0035C9.50171 11.4022 9.66011 11.7846 9.94206 12.0666L9.94234 12.0669L15.8841 17.9991L9.94351 23.9303C9.94332 23.9305 9.94312 23.9307 9.94292 23.9309C9.80267 24.0701 9.69133 24.2357 9.61531 24.4182C9.53919 24.6009 9.5 24.7969 9.5 24.9948C9.5 25.1928 9.53919 25.3887 9.61531 25.5715C9.69117 25.7535 9.80221 25.9189 9.94206 26.0579C10.0811 26.1978 10.2465 26.3088 10.4285 26.3847C10.6113 26.4608 10.8072 26.5 11.0052 26.5C11.2031 26.5 11.3991 26.4608 11.5818 26.3847C11.7643 26.3087 11.93 26.1973 12.0693 26.057C12.0694 26.0568 12.0696 26.0566 12.0697 26.0565L18.0009 20.1159L23.932 26.0565C23.9322 26.0567 23.9324 26.0569 23.9326 26.0571C24.0719 26.1974 24.2375 26.3087 24.4199 26.3847C24.6026 26.4608 24.7986 26.5 24.9965 26.5C25.1945 26.5 25.3904 26.4608 25.5732 26.3847C25.7552 26.3088 25.9206 26.1978 26.0596 26.0579C26.1995 25.9189 26.3105 25.7535 26.3864 25.5715C26.4625 25.3887 26.5017 25.1928 26.5017 24.9948C26.5017 24.7969 26.4625 24.6009 26.3864 24.4182C26.3105 24.2359 26.1993 24.0705 26.0592 23.9313L26.0594 23.9314L25.7061 24.2853L26.0582 23.9303L20.1177 17.9991ZM20.1177 17.9991L19.7638 18.3524M20.1177 17.9991L19.7638 18.3524M19.7638 18.3524L19.4101 17.9992M19.7638 18.3524L19.4101 17.9992M19.4101 17.9992L19.41 17.9991L19.4101 17.9992Z"
                  fill="#EC4899"
                  stroke="#EC4899"
                />
              </svg>

              <span className="sr-only">Close</span>
            </div>
          )}
        </header>
        <div
          className={cn(
            'content flex h-full w-full flex-1 flex-col justify-stretch rounded-b-lg bg-white',
            classNames,
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DialogLayout;
