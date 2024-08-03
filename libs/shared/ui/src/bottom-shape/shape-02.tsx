import cn from 'classnames';
import { Shape2 } from '@rocket-house-productions/shared';

type TProps = {
  className?: string;
  color?: string;
};

export const BottomShape = ({ className, color = 'fill-white' }: TProps) => {
  return (
    <div className={cn('bottom-shape z-1 absolute -bottom-px left-0 h-[70px] w-full', className)}>
      <Shape2 className={cn('h-full w-full', color)} />
    </div>
  );
};

export default BottomShape;
