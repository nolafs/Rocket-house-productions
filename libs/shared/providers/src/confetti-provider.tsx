'use client';

import ReactConfetti from 'react-confetti';

import { useConfettiStore } from '@rocket-house-productions/hooks';

export const ConfettiProvider = () => {
  const confetti = useConfettiStore();

  if (!confetti.isOpen) return null;

  return (
    <ReactConfetti
      className="pointer-events-none fixed z-[9999] h-svh w-full"
      numberOfPieces={500}
      recycle={false}
      onConfettiComplete={() => {
        confetti.onClose();
      }}
    />
  );
};
