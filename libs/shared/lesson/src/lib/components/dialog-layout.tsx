import { ReactNode } from 'react';

interface DialogLayoutProps {
  title: string;
  children: ReactNode;
}
export function DialogLayout({ title, children }: DialogLayoutProps) {
  return (
    <div className="relative h-[484px] w-[750px]">
      <div className="#fffaf3" />
      <div className="#fffaf3" />
      <img className="absolute left-[-201px] top-0 h-[100px] w-[1920px]" src="https://via.placeholder.com/1920x100" />
      <div className="absolute left-[40px] top-[28px] h-[348px]">
        <div className="font-['Mochiy Pop One'] absolute left-0 top-0 w-[670px] text-center text-3xl font-normal leading-[38px] text-white">
          {title}
        </div>
        <div className="#556987"> {children}</div>
        <div className="absolute left-[254.50px] top-[302px] inline-flex h-[46px] items-center justify-center gap-2 rounded-md bg-pink-500 px-[18px] py-3 shadow">
          <div className="font-['Nunito'] text-base font-bold leading-normal text-white">Let’s get started!</div>
        </div>
      </div>
    </div>
  );
}

export default DialogLayout;
