import { FC } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { ReviewSliderElfsight } from '@rocket-house-productions/features';
/**
 * Props for `ElfSight`.
 */
export type ElfSightProps = SliceComponentProps<Content.ElfSightSlice>;

/**
 * Component for "ElfSight" Slices.
 */
const ElfSight: FC<ElfSightProps> = ({ slice }) => {
  return (
    <Bounded as={'section'} yPadding={'sm'} data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div className={'flex items-center justify-center'}>
        <ReviewSliderElfsight share_link={slice.primary.elf_sight_widget} />
      </div>
    </Bounded>
  );
};

export default ElfSight;
