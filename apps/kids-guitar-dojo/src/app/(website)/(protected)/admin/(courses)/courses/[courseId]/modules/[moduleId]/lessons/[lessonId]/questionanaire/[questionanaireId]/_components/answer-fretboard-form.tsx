import { forwardRef, useImperativeHandle, useState } from 'react';

interface GridSelectorProps {
  rows: number;
  cols: number;
}

export interface GridSelectorHandle {
  getValue: () => string;
}

const AnswerFretboardForm = forwardRef<GridSelectorHandle, GridSelectorProps>(({ rows, cols }, ref) => {
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const handleCellClick = (cell: string) => {
    setSelectedCells(prev => {
      if (prev.includes(cell)) {
        return prev.filter(c => c !== cell);
      }
      return [...prev, cell];
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
          <div
            key={cell}
            onClick={() => handleCellClick(cell)}
            className={`line-height-10 h-10 w-10 cursor-pointer border border-black text-center ${selectedCells.includes(cell) ? 'bg-lightblue' : 'bg-white'}`}>
            {cell}
          </div>,
        );
      }
    }
    return grid;
  };

  return <div className={`grid grid-cols-${cols} gap-1`}>{createGrid()}</div>;
});

AnswerFretboardForm.displayName = 'AnswerFretboardForm';

export default AnswerFretboardForm;
