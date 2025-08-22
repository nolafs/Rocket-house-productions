import SectionTitle from '../section-title/section-title';
import { asText, GroupField, RichTextField } from '@prismicio/client';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { PrismicNextImage } from '@prismicio/next';
import { ButtonGroup } from '@rocket-house-productions/ui';

interface CtaColumnsProps {
  data: {
    headings: RichTextField | null | undefined;
    buttons?: GroupField;
    motto: { text: RichTextField | null | undefined };
    backgroundImage?: any;
  };
  color?: 'A' | 'B';
}

export function CtaOneColumn({ data: { headings, buttons, motto, backgroundImage }, color }: CtaColumnsProps) {
  return (
    <div className={'bg-primary relative isolate my-10 w-full overflow-hidden px-10 py-20 text-white md:py-28'}>
      {backgroundImage && (
        <motion.div
          className="overflow-hidden"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={scrollUpVariants}>
          <PrismicNextImage
            field={backgroundImage}
            width={1440}
            height={460}
            fallbackAlt=""
            className={
              'absolute inset-0 left-1/2 h-auto w-full min-w-[1800px] -translate-x-1/2 object-cover object-center'
            }
            imgixParams={{ fm: 'webp', fit: 'fill' }}
          />
        </motion.div>
      )}

      <div className={'z-1 container mx-auto flex flex-col px-0 lg:px-10'}>
        {headings && (
          <SectionTitle
            title={motto.text}
            subtitle={asText(headings)}
            align="center"
            titleSize="large"
            titleClass={'text-white'}
          />
        )}
        {buttons && (
          <div className="z-1 mt-10 flex items-center justify-center gap-x-5 lg:mt-10 lg:flex-shrink-0">
            <ButtonGroup buttons={buttons} className={'bg-primary-foreground !text-primary'} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CtaOneColumn;
