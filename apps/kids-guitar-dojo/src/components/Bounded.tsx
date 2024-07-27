import type { ReactNode } from 'react';
import cn from 'classnames';

type BoundedProps = {
  as?: 'div' | 'section' | 'header' | 'article';
  yPadding?: 'sm' | 'base' | 'lg';
  collapsible?: boolean;
  className?: string;
  children?: ReactNode;
};

export function Bounded({
  as: Comp = 'div',
  yPadding = 'base',
  collapsible = true,
  className,
  children,
}: BoundedProps) {
  return (
    <Comp
      data-collapsible={collapsible}
      className={cn(
        'px-6',
        yPadding === 'sm' && 'py-8 md:py-10',
        yPadding === 'base' && 'py-20 md:py-28',
        yPadding === 'lg' && 'py-32 md:py-48',
        className,
      )}
    >
      <div className="container mx-auto w-full">{children}</div>
    </Comp>
  );
}
