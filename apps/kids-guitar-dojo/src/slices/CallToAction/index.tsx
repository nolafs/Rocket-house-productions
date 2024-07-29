import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { CtaTwoColumn, CtaTwoColumnImage } from '@rocket-house-productions/features';

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction = ({ slice }: CallToActionProps): JSX.Element => {
  if (slice.variation === 'image') {
    return (
      <Bounded as={'div'} yPadding={'sm'}>
        <CtaTwoColumnImage
          data={{
            headings: slice.primary.heading,
            motto: { text: slice.primary.body },
            buttons: slice.primary.buttons,
            image: slice.primary.image,
          }}
        />
      </Bounded>
    );
  }

  return (
    <Bounded as={'div'} yPadding={'sm'}>
      <CtaTwoColumn
        data={{
          headings: slice.primary.heading,
          motto: { text: slice.primary.body },
          buttons: slice.primary.buttons,
        }}
      />
    </Bounded>
  );
};

export default CallToAction;
