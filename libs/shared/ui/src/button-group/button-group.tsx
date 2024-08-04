import { PrismicLink } from '@prismicio/react';
import cn from 'classnames';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import { GroupField } from '@prismicio/client';

type groupButton = {
  link: any;
  type: string;
  label: string;
  typeCase: string;
};

interface ButtonGroupProps {
  buttons?: GroupField;
  className?: string;
}

export function ButtonGroup({ buttons, className }: ButtonGroupProps) {
  const bts: groupButton[] = buttons as groupButton[];

  return (
    <>
      {bts?.map(({ link, type, label, typeCase }, index) => (
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
