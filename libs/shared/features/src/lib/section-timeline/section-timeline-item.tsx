import cn from 'classnames';
import { motion } from 'framer-motion';
import { scrollLeftVariants, scrollRightVariants } from '@rocket-house-productions/util';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { isFilled, KeyTextField } from '@prismicio/client';

export type SectionTimelineItemProps = {
  isEven: boolean;
  title?: KeyTextField | null | undefined;
  image: any;
  body: any;
  heading: any;
};

export function SectionTimelineItem({ isEven, title, image, heading, body }: SectionTimelineItemProps) {
  return (
    <li className="relative mb-10 grid w-full grid-cols-1 pl-[45px] last:mb-0 md:grid-cols-2 md:pl-0 lg:mb-[68px]">
      <div className="w-7.5 h-7.5 text-primary absolute left-0 top-0.5 before:absolute before:inset-0 before:rounded-full before:border before:border-current before:opacity-20 before:content-[''] md:left-1/2 md:-translate-x-1/2">
        <div className="absolute left-1/2 right-1/2 z-10 h-[14px] w-[14px] -translate-x-1/2 translate-y-1/2 rounded-full border-[3px] border-current bg-white" />
      </div>
      <motion.div
        className={cn('md:mx-7.5', !isEven && 'md:order-last xl:ml-auto', isEven && 'md:text-right')}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.4 }}
        variants={isEven ? scrollLeftVariants : scrollRightVariants}>
        <div className="lg:max-w-[500px]">
          {title && <h3 className="text-primary mb-7.5 text-xl font-medium lg:mb-14">{title}</h3>}
          {image && (
            <figure>
              <PrismicNextImage
                field={image}
                width={456}
                height={320}
                fallbackAlt=""
                imgixParams={{
                  fit: 'crop',
                  fm: 'webp',
                }}
                className="h-full w-full rounded object-cover"
              />
            </figure>
          )}
        </div>
      </motion.div>
      <motion.div
        className={cn('mt-7.5 md:pt-15 md:mx-7.5 md:mt-0 lg:pt-[130px]', !isEven && 'md:order-first md:text-right')}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.4 }}
        variants={isEven ? scrollRightVariants : scrollLeftVariants}>
        <div className={cn('lg:max-w-[500px]', isEven && 'md:ml-auto')}>
          {heading && (
            <h3 className="mb-[22px] text-xl font-bold">
              <PrismicRichText field={heading} />
            </h3>
          )}
          <div className={'leading-loose md:text-lg'}>
            <PrismicRichText field={body} />
          </div>
        </div>
      </motion.div>
    </li>
  );
}

export default SectionTimelineItem;
