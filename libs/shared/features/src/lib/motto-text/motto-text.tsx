import { forwardRef } from 'react';
import cn from 'classnames';
import { RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';

type TProps = {
  text?: any | RichTextField | null | undefined;
  path?: string | null | undefined;
  pathText?: any | null | undefined;
  className?: string;
  size?: 'md' | 'lg';
};

const MottoText = forwardRef<HTMLParagraphElement, TProps>(({ text, pathText, path, className, size }, ref) => (
  <div
    className={cn(
      'prose font-medium leading-relaxed !text-gray-500',
      size === 'md' && 'prose-md lg:prose-lg',
      size === 'lg' && 'prose-lg lg:prose-xl',
      className,
    )}
    ref={ref}>
    <PrismicRichText field={text} />
  </div>
));
export default MottoText;
