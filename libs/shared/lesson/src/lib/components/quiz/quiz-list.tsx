'use client';

import QuizListItem from './quiz-list-item';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui';
import Quiz from './quiz';
import QuizQuestionResult from './quiz-question-result';
import Fretboard from './fretboard/fretboard';
import cn from 'classnames';

gsap.registerPlugin(useGSAP);

interface GetQuizProps {
  questionaries: Quiz[];
  onSlideIndexChange: (index: number) => void;
  onQuizCompleted: () => void;
  onUpdateQuizScore: (correct: number) => void;
}

let displayTimeout: ReturnType<typeof setTimeout>;

export function QuizList({ questionaries, onQuizCompleted, onUpdateQuizScore, onSlideIndexChange }: GetQuizProps) {
  const ref = useRef<any>();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(questionaries.length === 1 ? true : false);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentCorrect, setCurrentCorrect] = useState(false);
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
      console.log('isQuizCompleted');
      onQuizCompleted();
    }
  }, [isQuizCompleted]);

  const onNext = contextSafe(() => {
    console.log('onNext');
    clearTimeout(displayTimeout);
    if (slideIndex !== questionaries.length - 1) {
      setSlideIndex(prevState => prevState + 1);
      setIsCompleted(false);
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
    console.log('onQuestionCompleted');
    clearTimeout(displayTimeout);
    setIsCompleted(true);
    if (isLastQuestion) {
      displayTimeout = setTimeout(() => {
        setIsCompleted(false);
        setIsQuizCompleted(true);
      }, 2000);
    } else {
      displayTimeout = setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  return (
    <>
      <div className={'relative isolate pb-20'}>
        <div ref={ref} className={'relative flex flex-1 overflow-hidden'}>
          <div className={'inner relative h-full w-full overflow-hidden'}>
            {questionaries.map((questionary, idx) => {
              switch (questionary.type) {
                case 'fretboard': {
                  return (
                    <div key={questionary.id} className={`slide-${idx} slide absolute h-full w-full overflow-hidden`}>
                      <Fretboard
                        questionary={questionary}
                        onQuestionCompleted={onQuestionCompleted}
                        onUpdateScore={(correct, current) => {
                          setCurrentCorrect(current);
                          setCorrectCount(prevState => prevState + correct);
                        }}
                      />
                    </div>
                  );
                }
                default: {
                  return (
                    <div key={questionary.id} className={`slide-${idx} slide absolute h-full w-full overflow-hidden`}>
                      <QuizListItem
                        questionary={questionary}
                        onQuestionCompleted={onQuestionCompleted}
                        onUpdateScore={(correct, incorrect, current) => {
                          setCurrentCorrect(current);
                          setCorrectCount(prevState => prevState + correct);
                        }}
                      />
                    </div>
                  );
                }
              }
            })}
          </div>
        </div>
        <QuizQuestionResult show={isCompleted} isCorrect={currentCorrect} />
      </div>
      {!isLastQuestion && (
        <div className={'flex justify-end border-t border-gray-100 py-5'}>
          <Button variant={'default'} size={'lg'} onClick={onNext} disabled={!isCompleted}>
            Next Question
          </Button>
        </div>
      )}
    </>
  );
}

export default QuizList;
