import dayjs from 'dayjs';
import { CalendarIcon } from 'lucide-react';
import cn from 'classnames';

const publishDateFormatted = (publishDate: string) => {
  return dayjs(publishDate).format('MMMM D, YYYY');
};

interface DateDisplayProps {
  publishDate: string | null | undefined;
  className?: string;
}

export function DateDisplay({ publishDate, className }: DateDisplayProps) {
  if (!publishDate) return null;

  return (
    <div className={cn('flex shrink items-center gap-2 text-sm font-semibold text-gray-400', className)}>
      <i>
        <CalendarIcon width={24} height={24} />
      </i>
      <time dateTime={publishDate as string}>{publishDateFormatted(publishDate)}</time>
    </div>
  );
}

export default DateDisplay;
