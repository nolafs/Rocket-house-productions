'use client';
import cn from 'classnames';
import { useScrollTop } from '@rocket-house-productions/hooks';
import { ArrowUp } from 'iconsax-react';

export const BackToTop = () => {
  const { stick, onClickHandler } = useScrollTop();

  return (
    <button
      aria-label="Scroll to top"
      type="button"
      className={cn(
        stick ? '-translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0',
        'right-7.5 bottom-15 shadow-3xl w-15 h-15 text-h3 bg-primary group fixed z-50 inline-flex items-center justify-center overflow-hidden rounded-full p-0 text-center text-white shadow-black/30 transition duration-500',
      )}
      onClick={onClickHandler}
    >
      <i
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white transition duration-300',
          'group-hover:-translate-y-20',
        )}
      >
        <ArrowUp size="32" color="#FFFFFF" />
      </i>
      <i
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-20 text-white transition duration-300',
          'group-hover:-translate-y-1/2',
        )}
      >
        <ArrowUp size="32" color="#FFFFFF" />
      </i>
    </button>
  );
};

export default BackToTop;
