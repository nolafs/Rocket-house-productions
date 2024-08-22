'use client';
import { Question, Questionary } from '@prisma/client';
import QuizListItem from './quiz-list-item';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRef, useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui';
import Quiz from './quiz';

gsap.registerPlugin(useGSAP);

interface GetQuizProps {
  questionaries: Quiz[];
}

export function QuizList({ questionaries }: GetQuizProps) {
  const ref = useRef<any>();
  const [slideIndex, setSlideIndex] = useState(0);
  const { contextSafe } = useGSAP({ scope: ref });

  useGSAP(
    () => {
      const slidesItem = gsap.utils.toArray('.slide > .item ');
      const slides = gsap.utils.toArray('.slide');
      // loop slides find largest height
      let largestHeight = 0;

      slides.forEach((slide: any, idx) => {
        gsap.set(slide, { xPercent: idx * 100 });
      });

      slidesItem.forEach((slide: any) => {
        if (slide.offsetHeight > largestHeight) {
          largestHeight = slide.offsetHeight;
        }
      });
      gsap.set('.inner', { height: largestHeight });
    },
    { scope: ref },
  );

  const onNext = contextSafe(() => {
    if (slideIndex !== questionaries.length - 1) {
      setSlideIndex(prevState => prevState + 1);
      gsap.to('.slide', { xPercent: '-=100', duration: 0.5 });
    }
  });

  return (
    <>
      <div ref={ref} className={'flex flex-1 overflow-hidden'}>
        <div className={'inner relative h-full w-full overflow-hidden'}>
          {questionaries.map(questionary => (
            <div key={questionary.id} className={'slide absolute h-full w-full'}>
              <QuizListItem questionary={questionary} />
            </div>
          ))}
        </div>
      </div>

      <div className={'mt-10 flex justify-end border-t border-gray-100 py-5'}>
        <Button variant={'default'} size={'lg'} onClick={onNext}>
          Next Question
        </Button>
      </div>
    </>
  );
}

export default QuizList;
