import { asText, GroupField, RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import { PrismicRichText } from '@prismicio/react';
import { BottomShape2, ButtonGroup } from '@rocket-house-productions/ui';
import { PrismicNextImage } from '@prismicio/next';
import cn from 'classnames';
import { titleToSlug } from '@rocket-house-productions/util';
import Ninja from '../assets/ninja.png';
import ThunderStarLeft from '../assets/thunderstarleft.svg';
import ThunderStarRight from '../assets/thunderstarright.svg';
import Image from 'next/image';

interface FeatureListProps {
  data: {
    headings: RichTextField | null | undefined;
    text?: string | null | undefined;
    buttons?: GroupField;
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
      <div className={'container mx-auto px-5'}>
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
            decor === 'A' ? 'lg:grid-cols-3' : 'lg:grid-cols-4',
          )}>
          {features?.length &&
            features.map(({ image, heading, body }, idx) => (
              <div
                key={titleToSlug(asText(heading) || idx.toString())}
                className={'flex flex-col items-center justify-items-stretch text-center'}>
                <div className="relative mb-5 h-[170px] w-[170px]">
                  <div className="absolute left-0 top-0 h-[170px] w-[170px] rounded-full bg-white shadow">
                    <PrismicNextImage
                      field={image}
                      width={150}
                      height={150}
                      fallbackAlt=""
                      className={'absolute left-[10px] top-[10px] h-[150px] w-[150px] rounded-full bg-white shadow'}
                      imgixParams={{ fit: 'fill', fm: 'webp', q: 75 }}
                    />
                  </div>
                </div>
                <div className={'grow'}>
                  <h3 className={'mb-4 text-2xl font-semibold leading-8'}>
                    <PrismicRichText field={heading} />
                  </h3>
                  <div className={'text-gray-900'}>
                    <PrismicRichText field={body} />
                  </div>
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
      {decor === 'A' && (
        <>
          <BottomShape2 />
          <div className={'absolute -bottom-16 left-1/2 z-20 -translate-x-1/2'}>
            <Image src={Ninja} alt={'ninja'} />
          </div>
          <div className={'absolute -bottom-16 -left-10 z-20 md:left-10'}>
            <Image src={ThunderStarLeft} alt={'star'} width={240} height={150} />
          </div>
          <div className={'absolute -bottom-16 -right-10 z-20 md:right-10'}>
            <Image src={ThunderStarRight} alt={'star'} width={190} height={162} />
          </div>
        </>
      )}
    </div>
  );
}

export default FeatureList;
