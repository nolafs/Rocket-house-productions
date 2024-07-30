import { forwardRef } from 'react';
import cn from 'classnames';
import { PrismicRichText } from '@prismicio/react';
import { RichTextField } from '@prismicio/client';

type TProps = {
  className?: string;
  title?: RichTextField | null | undefined;
  subtitle?: string | null | undefined;
  description?: RichTextField | null | undefined;
  align?: 'left' | 'right' | 'center';
  color?: 'A' | 'B' | 'C';
  titleSize?: 'default' | 'large';
  subtitleClass?: string;
  titleClass?: string;
  descClass?: string;
};

export const SectionTitle = forwardRef<HTMLDivElement, TProps>(
  (
    {
      className,
      title,
      subtitle,
      description,
      align = 'center',
      color = 'A',
      titleSize,
      subtitleClass,
      titleClass,
      descClass,
    },
    ref,
  ) => {
    return (
      <div className={cn('section-title relative z-10', align === 'center' && 'text-center', className)} ref={ref}>
        {subtitle && (
          <span
            className={cn(
              'relative mb-2 flex w-fit rounded-full px-3 py-1 text-sm font-bold uppercase leading-normal tracking-tight md:mb-5',
              color === 'A' && 'text-primary bg-secondary',
              color === 'B' && 'text-secondary',
              align === 'center' && 'mx-auto',
              subtitleClass,
            )}
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}

        <h2
          className={cn(
            'title child:text-primary child:font-normal m-0',
            color === 'A' && 'text-gray-900',
            color === 'C' && 'text-primary',
            titleSize === 'large' && 'text-4xl font-bold leading-tight lg:text-5xl',
            titleClass,
          )}>
          <PrismicRichText field={title} />
        </h2>

        {description && (
          <div className={cn('mb-0 mt-[25px] font-medium', descClass, color === 'C' && 'text-primary')}>
            <PrismicRichText field={description} />
          </div>
        )}
      </div>
    );
  },
);

export default SectionTitle;
