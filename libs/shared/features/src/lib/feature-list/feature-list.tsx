import { RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import MottoText from '../motto-text/motto-text';
import { PrismicRichText } from '@prismicio/react';
import { BottomShape2, ButtonGroup } from '@rocket-house-productions/ui';
import { PrismicNextImage } from '@prismicio/next';
import cn from 'classnames';

interface FeatureListProps {
  data: {
    headings: RichTextField | null | undefined;
    text?: string | null | undefined;
    buttons?: any[];
    motto: { text: RichTextField | null | undefined };
    features: any[];
  };
  color?: 'A' | 'B';
  decor?: 'A' | 'B';
}

export function FeatureList({
  data: { headings, text, buttons, motto, features },
  color = 'B',
  decor = 'B',
}: FeatureListProps) {
  return (
    <div className={cn(decor === 'A' && 'bg-accent/60 py-16 lg:py-24', 'relative')}>
      <div className={'container mx-auto'}>
        {headings && (
          <SectionTitle
            title={headings}
            subtitle={text}
            description={motto.text}
            align="center"
            color={decor === 'A' ? 'C' : 'A'}
            titleSize="large"
          />
        )}
        <div
          className={cn(
            'mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
            decor === 'A' ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
          )}>
          {features?.length &&
            features.map(({ image, heading, body }) => (
              <div className={'flex flex-col items-center text-center'}>
                <div className="relative mb-5 h-[170px] w-[170px]">
                  <div className="absolute left-0 top-0 h-[170px] w-[170px] rounded-full bg-white shadow">
                    <PrismicNextImage
                      field={image}
                      width={570}
                      height={570}
                      alt=""
                      className={'absolute left-[10px] top-[10px] h-[150px] w-[150px] rounded-full bg-white shadow'}
                      imgixParams={{ fit: 'fill' }}
                    />
                  </div>
                </div>
                <h3 className={'mb-4 text-2xl font-semibold leading-loose'}>
                  <PrismicRichText field={heading} />
                </h3>
                <div className={'text-gray-900'}>
                  <PrismicRichText field={body} />
                </div>
              </div>
            ))}
        </div>
        {buttons && (
          <div className={'mb-16 mt-10 flex justify-center gap-2.5'}>
            <ButtonGroup buttons={buttons} />
          </div>
        )}
      </div>
      <BottomShape2 />
    </div>
  );
}

export default FeatureList;
