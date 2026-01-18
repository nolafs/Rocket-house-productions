'use client';

import QuizListItem from './quiz-list-item';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import Quiz from './quiz';
import QuizQuestionResult from './quiz-question-result';
import Fretboard from './fretboard/fretboard';

gsap.registerPlugin(useGSAP);

interface GetQuizProps {
  questionaries: Quiz[];
  onSlideIndexChange: (index: number) => void;
  onQuizCompleted: () => void;
  onUpdateQuizScore: (correct: number) => void;
}

let displayTimeout: ReturnType<typeof setTimeout>;

export function QuizList({ questionaries, onQuizCompleted, onUpdateQuizScore, onSlideIndexChange }: GetQuizProps) {
  const ref = useRef<HTMLDivElement>(null);
  const slideIndexRef = useRef(0);
  const imageListenersRef = useRef<Map<HTMLImageElement, () => void>>(new Map());
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLastQuestion, setIsLastQuestion] = useState(questionaries.length === 1);
  const [correctCount, setCorrectCount] = useState(0);
  const [currentCorrect, setCurrentCorrect] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const { contextSafe } = useGSAP({ scope: ref });

  // Keep slideIndexRef in sync
  useEffect(() => {
    slideIndexRef.current = slideIndex;
  }, [slideIndex]);

  useGSAP(
    () => {
      if (!ref.current) return;

      const updateSizes = () => {
        if (!ref.current) return;
        const slidesItem: HTMLElement[] = gsap.utils.toArray('.slide');
        const containerWidth = ref.current.offsetWidth;

        slidesItem.forEach(item => {
          gsap.set(item, { width: containerWidth });
        });

        gsap.set('.inner', { width: containerWidth * slidesItem.length });

        // Update height based on current slide
        const items: HTMLDivElement[] = gsap.utils.toArray('.slide > .item');
        const currentIndex = slideIndexRef.current;
        if (items.length && items[currentIndex]) {
          gsap.set('.inner', { height: items[currentIndex].offsetHeight || 'auto' });
        }
      };

      // Handle image loading
      const setupImageListeners = () => {
        const images: HTMLImageElement[] = gsap.utils.toArray('.slide img');

        images.forEach(img => {
          // Skip if we already have a listener for this image
          if (imageListenersRef.current.has(img)) return;

          const onLoad = () => {
            updateSizes();
          };

          if (!img.complete) {
            img.addEventListener('load', onLoad);
            img.addEventListener('error', onLoad);
            imageListenersRef.current.set(img, onLoad);
          }
        });

        updateSizes();
      };

      // Use MutationObserver to detect content changes
      const mutationObserver = new MutationObserver(() => {
        setupImageListeners();
      });

      mutationObserver.observe(ref.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style'],
      });

      const resizeObserver = new ResizeObserver(() => {
        updateSizes();
      });

      resizeObserver.observe(ref.current);

      // Initial size update with fallbacks
      updateSizes();
      timeoutsRef.current.push(setTimeout(updateSizes, 100));
      timeoutsRef.current.push(setTimeout(updateSizes, 300));
      timeoutsRef.current.push(setTimeout(updateSizes, 500));

      setupImageListeners();

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();

        // Clear all timeouts
        timeoutsRef.current.forEach(t => clearTimeout(t));
        timeoutsRef.current = [];

        // Clean up image event listeners
        imageListenersRef.current.forEach((listener, img) => {
          img.removeEventListener('load', listener);
          img.removeEventListener('error', listener);
        });
        imageListenersRef.current.clear();
      };
    },
    { scope: ref, dependencies: [] },
  );

  // Update height when slideIndex changes
  useEffect(() => {
    if (!ref.current) return;
    const items: HTMLDivElement[] = gsap.utils.toArray('.slide > .item');
    if (items.length && items[slideIndex]) {
      gsap.set('.inner', { height: items[slideIndex].offsetHeight || 'auto' });
    }
  }, [slideIndex]);

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
    clearTimeout(displayTimeout);
    if (slideIndex !== questionaries.length - 1) {
      setSlideIndex(prevState => prevState + 1);
      setIsCompleted(false);

      const slidesItem: HTMLDivElement[] = gsap.utils.toArray('.slide > .item');

      if (slidesItem[slideIndex]) {
        gsap.to(`.inner`, { duration: 1, delay: 0.4, height: slidesItem[slideIndex + 1].offsetHeight || 'auto' });
      }

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
          <div className={`inner relative flex flex-row`}>
            {questionaries.map((questionary, idx) => {
              switch (questionary.type) {
                case 'fretboard': {
                  return (
                    <div key={questionary.id} className={`slide-${idx} slide h-auto overflow-hidden`}>
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
                    <div key={questionary.id} className={`slide-${idx} slide h-auto overflow-hidden`}>
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
