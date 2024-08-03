import cn from 'classnames';
import { StarIcon } from 'lucide-react';

type StarRatingProps = {
  rating?: number;
  className?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'sm' | 'md';
  space?: 'xs' | 'sm';
};

const BASE_RATING = 5;

export function StarRating({ rating = 5, className, align = 'center', size = 'md', space = 'sm' }: StarRatingProps) {
  if (rating < 0 || rating > BASE_RATING) {
    rating = BASE_RATING;
  }

  const unrated = Array.from(new Array(Math.floor(BASE_RATING - rating)), (_x, i) => i);
  const rated = Array.from(new Array(Math.floor(rating)), (_x, i) => i + 1);
  const remainder = rating - parseInt(`${rating}`, 10);

  return (
    <div
      title={`${rating} out of ${BASE_RATING}`}
      className={cn(
        'flex flex-row',
        size === 'md' && 'text-md',
        size === 'sm' && 'text-sm',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        align === 'right' && 'text-right',
        className,
      )}>
      {rated.map(item => (
        <i key={item} className={cn('text-yellow first:ml-0')}>
          <StarIcon fill="currentColor" size={size === 'sm' ? 16 : 24} />
        </i>
      ))}
      {remainder > 0 && (
        <i className={cn('text-yellow first:ml-0')}>
          {' '}
          <StarIcon size={size === 'sm' ? 16 : 24} />
        </i>
      )}
      {unrated.map(item => (
        <i key={item} className={cn('far fa-star text-gray-400 first:ml-0')}>
          <StarIcon fill="currentColor" size={size === 'sm' ? 16 : 24} />
        </i>
      ))}
    </div>
  );
}

export default StarRating;
