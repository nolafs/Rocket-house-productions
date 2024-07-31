import { KeyTextField, RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import cn from 'classnames';
import { BottomShape2 } from '@rocket-house-productions/ui';
import { PrismicRichText } from '@prismicio/react';

interface CtaColumnsTextProps {
  data: {
    headings: RichTextField | null | undefined;
    subtitle?: KeyTextField | null | undefined;
    buttons?: any[];
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
    <div className={cn(decor === 'A' && 'bg-accent/60 py-16 lg:py-24', 'relative')}>
      <div className={'container mx-auto'}>
        {headings && (
          <SectionTitle
            title={headings}
            subtitle={subtitle}
            align="center"
            color={decor === 'A' ? 'C' : 'A'}
            titleSize="large"
          />
        )}
        <div className={'mt-10 md:columns-2 md:gap-6'}>
          <PrismicRichText field={motto.text} />
        </div>
      </div>
      <BottomShape2 />
    </div>
  );
}

export default CtaTwoColumnText;
