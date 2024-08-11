import { ReactNode } from 'react';

interface DialogLayoutProps {
  title: string;
  children: ReactNode;
}
export function DialogLayout({ title, children }: DialogLayoutProps) {
  return (
    <div className="relative isolate h-full overflow-hidden rounded-xl bg-gray-100 pb-3 text-center">
      <div
        className={
          'bg-lesson-background text-lesson-foreground flex h-full min-h-[484px] w-full max-w-[750px] flex-col justify-stretch rounded-xl'
        }>
        <header className={'bg-pink-500 pb-8 pt-7'}>
          <h2 className="text-shadow relative text-3xl leading-[38px] text-white">{title}</h2>
        </header>
        <div className="content flex h-full w-full flex-1 flex-col justify-stretch px-6 pb-5 pt-7 md:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DialogLayout;
