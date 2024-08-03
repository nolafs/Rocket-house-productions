import { PrismicLink } from '@prismicio/react';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

type groupButton = {
  link: any;
  type: string;
  label: string;
  typeCase: string;
};

interface ButtonGroupProps {
  buttons?: groupButton[];
  className?: string;
}

export function ButtonGroup({ buttons, className }: ButtonGroupProps) {
  return (
    <>
      {buttons?.map(({ link, type, label, typeCase }, index) => (
        <PrismicLink
          key={(label + index).replace(/\s/g, '-').toLowerCase()}
          field={link}
          className={cn(
            buttonVariants({ variant: type === 'Outlined' ? 'outline' : 'default', size: 'lg' }),
            typeCase === 'Uppercase' && 'uppercase',
            className,
          )}>
          {label}
        </PrismicLink>
      ))}
    </>
  );
}

export default ButtonGroup;
