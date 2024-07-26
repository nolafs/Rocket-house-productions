import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import {Bounded} from '@components/Bounded';
import SectionTitle from '../../../../../libs/shared/features/src/lib/section-title/section-title';

/**
 * Props for `SectionHeaders`.
 */
export type SectionHeadersProps = SliceComponentProps<Content.SectionHeadersSlice>;

/**
 * Component for "SectionHeaders" Slices.
 */
const SectionHeaders = ({ slice }: SectionHeadersProps): JSX.Element => {

  const section_title = {
    title: slice.primary.heading,
    subtitle: slice.primary.subheading,
  }

  return (
    <Bounded as={'header'} yPadding={'sm'} className="max-w-8xl mx-auto">
      {section_title && (
        <SectionTitle
          {...section_title}
          align='center'
          titleSize='large'
        />
      )}
    </Bounded>
  );
};

export default SectionHeaders;
