import cn from 'classnames';
import { ReactComponent as BottomShapeSVG } from '@assets/svgs/bottom-shape-5.svg';

type TProps = {
  className?: string;
  color?: string;
};

export const BottomShape = ({ className, color = 'fill-white' }: TProps) => {
  return (
    <div
      className={cn(
        'z-1 absolute -bottom-px left-0 h-20 w-[calc(100%_+_1.3px)] rotate-180 overflow-hidden md:h-[600px]',
        className,
      )}>
      <BottomShapeSVG className={cn('rotate-y-180-translate-x-half relative left-1/2 block h-full w-full', color)} />
    </div>
  );
};

export default BottomShape;