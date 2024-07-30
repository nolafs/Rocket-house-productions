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
}

export function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <>
      {buttons?.map(({ link, type, label, typeCase }) => (
        <PrismicLink
          field={link}
          className={cn(
            buttonVariants({ variant: type === 'Outlined' ? 'outline' : 'default', size: 'lg' }),
            typeCase === 'Uppercase' && 'uppercase',
          )}>
          {label}
        </PrismicLink>
      ))}
    </>
  );
}

export default ButtonGroup;
