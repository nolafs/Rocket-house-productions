import Image from 'next/image';
import Bg from '@assets/bg-scene.png';

export default function Page() {
  return (
    <div className={'h-svh max-h-svh w-full'}>
      <div
        className={
          'text-primary absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-5xl font-bold'
        }>
        Lesson Page
      </div>
      <Image src={Bg} alt="lesson" className={'h-full w-full object-cover object-center'} />
    </div>
  );
}
