import { ReactComponent as BottomShapeSVG } from '@rocket-house-productions/shared';
import cn from 'classnames';

type TProps = {
  className?: string;
  color?: string;
};

export const BottomShape = ({ className, color = 'fill-white' }: TProps) => {
  return (
    <div className={cn('bottom-shape z-1 absolute -bottom-px left-0 h-[70px] w-full rotate-180', className)}>
      <BottomShapeSVG className={cn('h-full w-full', color)} />
    </div>
  );
};

export default BottomShape;
