import { ReactNode } from 'react';
import { cn } from '@rocket-house-productions/util';

interface DialogLayoutProps {
  title: string;
  children: ReactNode;
  classNames?: string;
}
export function DialogLayout({ title, children, classNames }: DialogLayoutProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gray-100 pb-3 text-center">
      <div
        className={
          'bg-lessons-background text-lessons-foreground flex h-full w-full flex-col rounded-xl md:min-h-[484px] lg:min-w-[750px] lg:max-w-[750px]'
        }>
        <header className={'bg-pink-500 pb-4 pt-3.5 text-center lg:pb-8 lg:pt-7'}>
          <h2 className="text-shadow relative text-xl leading-[38px] text-white md:text-2xl lg:text-3xl">{title}</h2>
        </header>
        <div
          className={cn(
            'content flex h-full w-full flex-1 flex-col justify-stretch px-6 pb-5 pt-7 md:px-10',
            classNames,
          )}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DialogLayout;
