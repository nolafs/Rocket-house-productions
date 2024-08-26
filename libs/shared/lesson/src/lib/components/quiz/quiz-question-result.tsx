'use client';
import Image from 'next/image';
import char from '../../assets/char.png';
import cn from 'classnames';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface QuizQuestionResultProps {
  show: boolean;
  isCorrect: boolean;
}

export function QuizQuestionResult({ show, isCorrect }: QuizQuestionResultProps) {
  const ref = useRef<any>();

  useGSAP(
    () => {
      if (show) {
        gsap.set('.notification', { opacity: 0, yPercent: 100, rotateZ: -100 });
        gsap.to('.notification', {
          opacity: 1,
          yPercent: 0,
          rotateZ: 0,
          duration: 0.2,
          ease: 'back.out(1.7)',
        });
      } else {
        gsap.to('.notification', {
          opacity: 0,
          yPercent: 100,
          rotateZ: -100,
          duration: 0.2,
          ease: 'back.in(1.7)',
        });
      }
    },
    { scope: ref, dependencies: [show] },
  );

  return (
    <div
      ref={ref}
      className={cn(
        'end-display pointer-events-none absolute -bottom-2 right-0 z-10 flex w-full justify-end overflow-hidden',
      )}>
      <div className={'notification relative flex max-w-[300px] justify-end opacity-0'}>
        <Image className={'char'} src={char} alt="char" width={143} height={243} />
        {isCorrect ? (
          <div
            className={
              'bubble speech-bubble success speech-bubble-bottom-right !font-lesson-heading absolute -top-0 right-[130px] mx-auto w-fit min-w-[300px] rounded-xl bg-green-500 p-5 text-white shadow-sm shadow-black/20'
            }>
            Well done! Correct answer, you on way to be come a guitar master.
          </div>
        ) : (
          <div
            className={
              'bubble speech-bubble error speech-bubble-bottom-right !font-lesson-heading absolute -top-0 right-[130px] mx-auto w-fit min-w-[300px] rounded-xl bg-red-500 p-5 text-white shadow-sm shadow-black/20'
            }>
            Sorry! Incorrect answer, better luck next time.
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizQuestionResult;
