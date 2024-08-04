import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { Bounded } from '@components/Bounded';
import { CtaTwoColumn, CtaTwoColumnImage, CtaTwoColumnText, CtaOneColumn } from '@rocket-house-productions/features';

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
      <Bounded as={'section'} yPadding={'sm'}>
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

  if (slice.variation === 'textTwoColumn') {
    return (
      <Bounded as={'section'} yPadding={'sm'} fullWidth={true}>
        <CtaTwoColumnText
          data={{
            headings: slice.primary.heading,
            motto: { text: slice.primary.body },
            buttons: slice.primary.buttons,
            subtitle: slice.primary.subtitle,
          }}
        />
      </Bounded>
    );
  }

  if (slice.variation === 'center') {
    return (
      <>
        <CtaOneColumn
          data={{
            headings: slice.primary.heading,
            motto: { text: slice.primary.body },
            buttons: slice.primary.buttons,
            backgroundImage: slice.primary.background_image,
          }}
        />
      </>
    );
  }

  return (
    <Bounded as={'section'} yPadding={'sm'}>
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
