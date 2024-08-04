'use client';
import { GroupField, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import MottoText from '../motto-text/motto-text';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { PrismicNextImage } from '@prismicio/next';
import { ButtonGroup } from '@rocket-house-productions/ui';

interface CtaColumnsProps {
  data: {
    headings: RichTextField | null | undefined;
    buttons?: GroupField;
    motto: { text: RichTextField | null | undefined };
    image: any;
  };
  color?: 'A' | 'B';
}

export function CtaTwoColumnImage({ data: { headings, buttons, motto, image }, color }: CtaColumnsProps) {
  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      variants={scrollUpVariants}>
      <div className={'cta relative w-full lg:my-52'}>
        <div className={'gap-7.5 container mx-auto grid grid-cols-1 items-center overflow-visible md:grid-cols-2'}>
          <div className={'overflow-visible'}>
            {image && (
              <PrismicNextImage
                field={image}
                width={819}
                height={567}
                fallbackAlt=""
                className={
                  'lg:max-width-[819px] z-10 h-auto w-[100%] lg:absolute lg:right-1/2 lg:top-1/2 lg:-translate-y-1/2'
                }
                imgixParams={{ fm: 'webp', fit: 'fill' }}
              />
            )}
          </div>
          <div className={'p-4 md:p-10'}>
            <h2 className={'text-3xl font-bold leading-[1.17] sm:text-4xl lg:text-5xl'}>
              <PrismicRichText field={headings} />
            </h2>
            {motto && <MottoText {...motto} size="lg" className="mt-[25px]" />}
            {buttons && (
              <div className="mt-10 flex flex-col gap-5 md:flex-row lg:flex-shrink-0">
                <ButtonGroup buttons={buttons} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default CtaTwoColumnImage;
