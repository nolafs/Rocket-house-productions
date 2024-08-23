import styles from './quiz-question-result.module.css';
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
        gsap.to(ref.current, {
          opacity: 1,
          yPercent: -100,
          duration: 0.5,
        });
      }
    },
    { scope: ref, dependencies: [show] },
  );

  return (
    <div
      ref={ref}
      className={cn(
        'end-display pointer-events-none absolute -bottom-2 left-1/2 z-10 w-fit -translate-x-1/2 opacity-0',
      )}>
      <div className={'relative'}>
        <Image className={'char'} src={char} alt="char" width={143} height={243} />
        {isCorrect ? (
          <div
            className={
              'bubble !font-lesson-heading absolute -top-10 left-[130px] mx-auto w-fit min-w-[250px] rounded-xl bg-green-500 p-5 text-white shadow-sm shadow-black/20'
            }>
            Well done! Correct answer, you on way to be come a guitar master.
          </div>
        ) : (
          <div
            className={
              'bubble !font-lesson-heading absolute -top-10 left-[130px] mx-auto w-fit min-w-[250px] rounded-xl bg-red-500 p-5 text-white shadow-sm shadow-black/20'
            }>
            Sorry! Incorrect answer, better luck next itme
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizQuestionResult;
