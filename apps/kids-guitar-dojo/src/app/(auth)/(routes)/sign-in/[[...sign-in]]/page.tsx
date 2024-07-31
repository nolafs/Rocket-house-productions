import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <main>
      <div className={'flex h-svh min-h-svh w-full flex-col justify-center md:flex-row'}>
        <div className={'bg-primary md:w-1/2'}></div>
        <div className={'flex w-full items-center justify-center bg-white md:w-1/2'}>
          <SignIn />
        </div>
      </div>
    </main>
  );
}
