'use client';
import { RichTextField } from '@prismicio/client';
import { PrismicLink, PrismicRichText } from '@prismicio/react';
import MottoText from '../motto-text/motto-text';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import cn from 'classnames';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { PrismicNextImage } from '@prismicio/next';

interface CtaColumnsProps {
  data: {
    headings: RichTextField | null | undefined;
    buttons?: any[];
    motto: { text: RichTextField | null | undefined };
    image: any;
  };
  color?: 'A' | 'B';
}

export function CtaTwoColumnImage({ data: { headings, buttons, motto, image }, color }: CtaColumnsProps) {
  return (
    <div className={'cta relative w-full lg:my-40'}>
      <div className={'gap-7.5 container mx-auto grid grid-cols-1 items-center overflow-visible md:grid-cols-2'}>
        <div className={'overflow-visible'}>
          {image && (
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              variants={scrollUpVariants}>
              <PrismicNextImage
                field={image}
                width={819}
                height={567}
                alt=""
                className={
                  'lg:max-width-[819px] z-10 h-auto w-[100%] lg:absolute lg:right-1/2 lg:top-1/2 lg:-translate-y-1/2'
                }
                imgixParams={{ fit: 'fill' }}
              />
            </motion.div>
          )}
        </div>
        <div className={'p-4 md:p-10'}>
          <h2 className={'text-3xl font-bold leading-[1.17] sm:text-4xl lg:text-5xl'}>
            <PrismicRichText field={headings} />
          </h2>
          {motto && <MottoText {...motto} size="lg" className="mt-[25px]" />}
          {buttons && (
            <div className="mt-10 flex flex-col gap-5 md:flex-row lg:flex-shrink-0">
              {buttons?.map(({ link, type, label, typeCase }) => (
                <PrismicLink
                  field={link}
                  className={cn(
                    buttonVariants({ variant: type === 'Outlined' ? 'outline' : 'default', size: 'lg' }),
                    typeCase === 'Uppercase' && 'uppercase',
                  )}>
                  {label}
                </PrismicLink>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CtaTwoColumnImage;
