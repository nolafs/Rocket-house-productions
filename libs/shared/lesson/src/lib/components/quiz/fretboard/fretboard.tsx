import { forwardRef, useRef, useState } from 'react';
import { Question, Questionary } from '@prisma/client';
import Image from 'next/image';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Draggable from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface FretboardProps {
  questionary: Questionary & { questions: Question[] };
  isSelected: {
    correctAnswer: boolean;
    id: string;
  } | null;
  value: any;
  onChange: any;
}

interface FretboardHandleProps {
  getValues: any;
}

const Fretboard = forwardRef<FretboardHandleProps, FretboardProps>(
  ({ questionary, value, onChange, isSelected }, ref) => {
    const fretboardRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);

    const rows = 7;
    const cols = 6;

    const { contextSafe } = useGSAP(
      () => {
        const dragItems: HTMLDivElement[] = gsap.utils.toArray('#drag-items > div');
        const dropZones: HTMLDivElement[] = gsap.utils.toArray('.dropzone');

        if (dragItems.length === 0) return;
        if (!fretboardRef.current) return;
        if (!dropZones.length) return;

        console.log('dropZones', dropZones.length);
        console.log('dropZones', dropZones[0].offsetTop, dropZones[0].getBoundingClientRect().y);

        console.log(
          'fretboardRef.current',
          fretboardRef.current.getBoundingClientRect().width,
          fretboardRef.current.getBoundingClientRect().height,
        );

        for (let i = 0; i <= dragItems.length; i++) {
          Draggable.create(dragItems[i], {
            bounds: {
              top: 0,
              left: 0,
              width: fretboardRef.current.getBoundingClientRect().width,
              height: fretboardRef.current.getBoundingClientRect().height,
              minX: 0,
              minY: 0,
              maxX: fretboardRef.current.getBoundingClientRect().width,
              maxY: fretboardRef.current.getBoundingClientRect().height,
            },
            inertia: true,
            type: 'x,y',
            onRelease: function (event) {
              let current: { correct: boolean; x: string; y: string } | null = null;

              dropZones.forEach(dropZone => {
                if (this.hitTest(dropZone)) {
                  const answerArray = this.target.dataset.value.split(',');
                  const dropAnswer = dropZone?.dataset?.value;

                  console.log('answerArray', answerArray, dropAnswer);

                  // check answer array includes arrays in it correctAnswerArray

                  const correct = answerArray.includes(dropAnswer);

                  dropZone.classList.add(correct ? 'bg-green-500/20' : 'bg-red-500/20');

                  current = {
                    correct: correct,
                    x: '+=' + (dropZone.getBoundingClientRect().left - this.target.getBoundingClientRect().left),
                    y: '+=' + (dropZone.getBoundingClientRect().top - this.target.getBoundingClientRect().top),
                  };
                }
              });

              if (current !== null) {
                console.log('hit', current);
                const { x, y } = current as { x: string; y: string };
                gsap.to(this.target, { x: x, y: y });
              } else {
                console.log('not hit');
                gsap.to(this.target, { x: 0, y: 0 });
              }

              current = null;
            },
          });
        }
      },
      { scope: fretboardRef, dependencies: [ready] },
    );

    return (
      <div ref={fretboardRef} className={'relative isolate flex w-full flex-col space-y-10 bg-amber-300/50'}>
        <div id={'drag-items'} className={'relative flex w-full space-x-2 bg-amber-700'}>
          {/* items */}

          {questionary.questions.map((item, index) => (
            <div
              data-value={item.boardCordinates}
              id={`item-${item.id}`}
              key={item.id}
              className={'z-50 h-10 w-10 border border-black'}>
              <div id={`item-${item.id}-image`}>
                {item?.imageUrl && <Image src={item?.imageUrl} alt={item.title} width={50} height={50} />}
              </div>
            </div>
          ))}
        </div>

        <div id={'fretboard-grid'} className={'w-full'}>
          <div className={'grid grid-cols-6 gap-5'}>
            <FretboardGrid rows={rows} cols={cols} />
          </div>
        </div>
      </div>
    );
  },
);

const FretboardGrid = ({ rows, cols }: { rows: number; cols: number }) => {
  const grid = [];

  for (let row = 1; row <= rows; row++) {
    for (let col = 1; col <= cols; col++) {
      const cell = `${String.fromCharCode(96 + col)}-${row}`; // 'a-1', 'b-1', etc.
      grid.push(
        <div
          key={cell}
          id={cell}
          className={`line-height-10 relative h-20 w-full cursor-pointer border border-black text-center`}>
          <div className={'dropzone z-0 h-full w-full'} data-value={cell}>
            {cell}
          </div>
        </div>,
      );
    }
  }

  return <>{grid.map(cell => cell)}</>;
};

Fretboard.displayName = 'Fretboard';

export default Fretboard;
