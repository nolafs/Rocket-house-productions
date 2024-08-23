'use client';

import QuizListItem from './quiz-list-item';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui';
import Quiz from './quiz';

gsap.registerPlugin(useGSAP);

interface GetQuizProps {
  questionaries: Quiz[];
  onSlideIndexChange: (index: number) => void;
  onQuizCompleted: () => void;
  onUpdateQuizScore: (correct: number) => void;
}

export function QuizList({ questionaries, onQuizCompleted, onUpdateQuizScore, onSlideIndexChange }: GetQuizProps) {
  const ref = useRef<any>();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
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

  useEffect(() => {
    onSlideIndexChange(slideIndex + 1);
  }, [slideIndex]);

  useEffect(() => {
    onUpdateQuizScore(correctCount);
  }, [correctCount]);

  useEffect(() => {
    if (isQuizCompleted) {
      onQuizCompleted();
    }
  }, [isQuizCompleted]);

  const onNext = contextSafe(() => {
    if (slideIndex !== questionaries.length - 1) {
      setSlideIndex(prevState => prevState + 1);
      gsap.to('.slide', {
        xPercent: '-=100',
        duration: 0.4,
        onComplete: () => {
          if (slideIndex + 1 === questionaries.length - 1) {
            setIsLastQuestion(true);
          }
        },
      });
    }
  });

  const onQuestionCompleted = () => {
    setIsCompleted(true);
    setTimeout(() => {
      onNext();
      setIsCompleted(false);
      if (isLastQuestion) {
        setIsQuizCompleted(true);
      }
    }, 1000);
  };

  return (
    <>
      <div ref={ref} className={'flex flex-1 overflow-hidden'}>
        <div className={'inner relative h-full w-full overflow-hidden'}>
          {questionaries.map(questionary => (
            <div key={questionary.id} className={'slide absolute h-full w-full'}>
              <QuizListItem
                questionary={questionary}
                onQuestionCompleted={onQuestionCompleted}
                onUpdateScore={(correct, incorrect) => {
                  console.log('onUpdateScore');
                  setCorrectCount(prevState => prevState + correct);
                }}
              />
            </div>
          ))}
        </div>
      </div>
      {!isLastQuestion && (
        <div className={'mt-10 flex justify-end border-t border-gray-100 py-5'}>
          <Button variant={'default'} size={'lg'} onClick={onNext} disabled={!isCompleted}>
            Next Question
          </Button>
        </div>
      )}
    </>
  );
}

export default QuizList;
