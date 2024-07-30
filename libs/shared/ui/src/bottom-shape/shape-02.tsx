import cn from 'classnames';
import { ReactComponent as BottomShapeSVG } from './assets/bottom-shape-2.svg';

type TProps = {
  className?: string;
  color?: string;
};

export const BottomShape = ({ className, color = 'fill-white' }: TProps) => {
  return (
    <div className={cn('bottom-shape z-1 absolute -bottom-px left-0 h-[70px] w-full', className)}>
      <BottomShapeSVG className={cn('h-full w-full', color)} />
    </div>
  );
};

export default BottomShape;
