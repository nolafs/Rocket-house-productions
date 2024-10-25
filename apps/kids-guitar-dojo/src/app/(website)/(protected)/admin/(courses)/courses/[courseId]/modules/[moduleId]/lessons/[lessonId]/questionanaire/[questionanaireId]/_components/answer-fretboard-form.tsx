import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface GridSelectorProps {
  rows: number;
  cols?: number;
  value?: string; // optional value prop for controlled behavior
  onChange?: (value: string) => void;
}

export interface GridSelectorHandle {
  getValue: () => string;
}

const AnswerFretboardForm = forwardRef<GridSelectorHandle, GridSelectorProps>(
  ({ rows, cols = 6, value = '', onChange }, ref) => {
    const [selectedCells, setSelectedCells] = useState<string[]>([]);

    // Initialize selectedCells based on value prop
    useEffect(() => {
      if (value) {
        setSelectedCells(value.split(',').filter(Boolean));
      } else {
        // Set default selected values, e.g., 'a-1', 'b-1'
        setSelectedCells([]); // Modify this to your desired default selection
      }
    }, [value]);

    const handleCellClick = (cell: string) => {
      setSelectedCells(prev => {
        const newSelectedCells = prev.includes(cell) ? prev.filter(c => c !== cell) : [...prev, cell];

        // Call the onChange callback if provided
        if (onChange) {
          onChange(newSelectedCells.join(','));
        }
        return newSelectedCells;
      });
    };

    const getSelectedString = () => {
      return selectedCells.join(',');
    };

    useImperativeHandle(ref, () => ({
      getValue: getSelectedString,
    }));

    const createGrid = () => {
      const grid = [];
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= cols; col++) {
          const cell = `${String.fromCharCode(96 + col)}-${row}`; // 'a-1', 'b-1', etc.
          grid.push(
            <div key={cell} className={`relative h-10 w-full cursor-pointer border-b-4 border-[#f2dcd3ff] px-5`}>
              <div
                onClick={() => handleCellClick(cell)}
                className={`h-full cursor-pointer text-center text-[6px] ${selectedCells.includes(cell) ? 'bg-green-500' : 'bg-transparent'}`}>
                {cell}
              </div>
            </div>,
          );
        }
      }
      return grid;
    };

    return (
      <div
        className={
          'relative isolate mx-auto w-full max-w-[320px] border-t-8 border-[#f2dc0cff] bg-gradient-to-r from-[#54311bff] via-[#7c4e2dff] to-[#54311bff] shadow-2xl'
        }>
        <div className={'pointer-events-none absolute left-0 top-0 z-0 grid h-full w-full grid-cols-6 gap-x-0 gap-y-0'}>
          <div className={'string string px-[22px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#eccaa5ff] via-[#b0967bff] via-50% to-[#b0967bff] shadow-sm'
              }
            />
          </div>
          <div className={'string px-[22.5px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#f0cda7ff] from-50% via-[#c3a688ff] to-[#c3a688ff] shadow-sm'
              }
            />
          </div>
          <div className={'string px-[23px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#eecab0ff] from-50% via-[#be9f8cff] to-[#be9f8cff] shadow-sm'
              }
            />
          </div>
          <div className={'string px-[23.5px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#eed8c3ff] from-50% via-[#bcab9bff] to-[#bcab9bff] shadow-sm'
              }
            />
          </div>
          <div className={'string px-[24px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#ecececff] from-50% via-[#8e8e8eff] to-[#8e8e8eff] shadow-sm'
              }
            />
          </div>
          <div className={'string px-[24.5px]'}>
            <div
              className={
                'inlay h-full w-full bg-gradient-to-r from-[#fcfcfcff] from-50% via-[#a2a2a2ff] to-[#a2a2a2ff] shadow-sm'
              }
            />
          </div>
        </div>
        <div className={`relative grid grid-cols-${cols} z-2 gap-0`}>{createGrid()}</div>
      </div>
    );
  },
);

AnswerFretboardForm.displayName = 'AnswerFretboardForm';

export default AnswerFretboardForm;
