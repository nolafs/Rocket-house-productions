import cn from 'classnames';

interface HeaderSimpleProps {
  header: string | undefined | null;
  align?: 'left' | 'right' | 'center';
  size?: 'default' | 'large';
  type?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  className?: string;
  description?: string | undefined | null;
}
export function HeaderSimple({
  header,
  description,
  align = 'center',
  size = 'default',
  className,
  type: Comp = 'h2',
}: HeaderSimpleProps) {
  return (
    <div className="px-6 pt-20 sm:pb-10 sm:pt-32 lg:px-8">
      <div
        className={cn(
          'mx-auto',
          size === 'large' ? 'container w-full max-w-4xl' : 'max-w-2xl',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          align === 'left' && 'text-left',
          className,
        )}>
        <Comp className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">{header}</Comp>
        {description && <p className={'mt-5 text-lg font-bold'}>{description}</p>}
      </div>
    </div>
  );
}

export default HeaderSimple;
