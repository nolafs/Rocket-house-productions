import { GroupField, KeyTextField, RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import cn from 'classnames';
import { BottomShape2, ButtonGroup } from '@rocket-house-productions/ui';
import { PrismicRichText } from '@prismicio/react';

interface CtaColumnsTextProps {
  data: {
    headings: RichTextField | null | undefined;
    subtitle?: KeyTextField | null | undefined;
    buttons?: GroupField;
    motto: { text: RichTextField | null | undefined };
  };
  color?: 'A' | 'B';
  decor?: 'A' | 'B';
}

export function CtaTwoColumnText({
  data: { headings, buttons, motto, subtitle },
  color = 'A',
  decor = 'A',
}: CtaColumnsTextProps) {
  return (
    <div className={cn(decor === 'A' && 'bg-accent/60 py-16 lg:py-24', 'relative px-5')}>
      <div className={'container mx-auto'}>
        <div className={'grid md:grid-cols-2'}>
          {headings && (
            <SectionTitle
              title={headings}
              subtitle={subtitle}
              align="left"
              color={decor === 'A' ? 'C' : 'A'}
              titleSize="large"
            />
          )}
          {buttons && (
            <div className="z-1 mt-10 hidden items-center justify-end gap-x-5 md:flex lg:mt-10 lg:flex-shrink-0">
              <ButtonGroup buttons={buttons} />
            </div>
          )}
        </div>
        <div className={'mb-20 mt-10 md:columns-2 md:gap-6'}>
          <PrismicRichText field={motto.text} />
        </div>
        {buttons && (
          <div className="z-1 mt-10 flex items-center justify-center gap-x-5 md:hidden lg:mt-10 lg:flex-shrink-0">
            <ButtonGroup buttons={buttons} />
          </div>
        )}
      </div>
      <BottomShape2 />
    </div>
  );
}

export default CtaTwoColumnText;
