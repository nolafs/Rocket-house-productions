import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface GridSelectorProps {
  rows: number;
  cols: number;
  value?: string; // optional value prop for controlled behavior
  onChange?: (value: string) => void;
}

export interface GridSelectorHandle {
  getValue: () => string;
}

const AnswerFretboardForm = forwardRef<GridSelectorHandle, GridSelectorProps>(
  ({ rows, cols, value = '', onChange }, ref) => {
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
  },
);

AnswerFretboardForm.displayName = 'AnswerFretboardForm';

export default AnswerFretboardForm;
