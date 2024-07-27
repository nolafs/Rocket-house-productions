'use client';
import { motion } from 'framer-motion';
import { useUI } from '@rocket-house-productions/hooks';
import SectionTitle from '../section-title/section-title';
import MottoText from '../motto-text/motto-text';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { MottoType, SectionTitleType } from '@rocket-house-productions/types';
import cn from 'classnames';
import { PrismicNextImage } from '@prismicio/next';
import Image from 'next/image';

import GridShape1 from './shapes/grid-shape-1.png';
import Shape1 from './shapes/shape-1.png';
import Ring from './shapes/ring-shape-1.png';

interface ContentBlockImageProps {
  data: {
    section_title: SectionTitleType;
    motto: MottoType;
    images: any[];
  };
  titleSize?: 'default' | 'large' | undefined;
  alignment?: 'Left' | 'Right' | undefined;
  hasDecor?: boolean;
}

export function ContentBlockImage({
  data: { section_title, motto, images },
  titleSize,
  alignment = 'Right',
  hasDecor,
}: ContentBlockImageProps) {
  const { trans1 } = useUI();

  return (
    <div className="lg:gap-7.5 container grid items-center gap-[50px] lg:grid-cols-2">
      <motion.div
        className={cn(
          'lg:max-w-[420px]',
          alignment === 'Right' && 'order-2 lg:order-1',
          alignment === 'Left' && 'order-2 justify-self-end lg:order-2',
        )}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={scrollUpVariants}>
        {section_title && <SectionTitle {...section_title} align="left" titleSize={titleSize} />}
        {motto && <MottoText className="mt-4" size="md" {...motto} />}
      </motion.div>
      <div
        className={cn(
          'relative',
          alignment === 'Right' && 'order-1 lg:order-2',
          alignment === 'Left' && 'order-1 lg:order-1',
        )}>
        {images?.[0] && (
          <motion.div
            className="relative z-10"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.1 }}
            variants={scrollUpVariants}>
            <PrismicNextImage
              field={images?.[0].image}
              alt={images?.[0].alt}
              width={570}
              height={360}
              imgixParams={{ fit: 'fill', w: 570, h: 360 }}
              className="rounded"
            />
          </motion.div>
        )}
        {images?.[1] && (
          <div
            className={cn(
              'absolute top-[-90px] z-20',
              alignment === 'Left' && '3xl:left-[-73px] left-5',
              alignment === 'Right' && '3xl:right-[-73px] right-0',
            )}>
            <PrismicNextImage
              field={images?.[1].image}
              width={190}
              height={190}
              alt={images?.[1].alt}
              imgixParams={{ fit: 'fill', w: 190, h: 190 }}
              className="rounded"
            />
          </div>
        )}
        {hasDecor && (
          <>
            <motion.div
              className={cn(
                'z-1 absolute top-[-51px]',
                alignment === 'Right' && 'lg:left-[-107px]',
                alignment === 'Left' && 'lg:left-0',
              )}
              animate={{
                x: trans1().x,
                y: trans1().y,
              }}>
              <span className="border-desert lg:w-15 lg:h-15 block h-[45px] w-[45px] rounded-full border-[7px] -indent-[99999px]">
                shape 1
              </span>
            </motion.div>
            <motion.div
              className="z-1 absolute bottom-[-26px] left-0 w-20 lg:-left-10 lg:w-auto"
              animate={{
                x: trans1().x,
                y: trans1().y,
              }}>
              <Image src={GridShape1} alt="decore shape 1 content block" />
            </motion.div>
            <motion.div
              className="z-1 absolute -bottom-10 right-2.5 w-20 lg:w-auto"
              animate={{
                x: trans1().x,
                y: trans1().y,
              }}>
              <Image src={Ring} alt="decore shape 3 content block" />
            </motion.div>
            <motion.div
              className="z-1 absolute left-[360px] top-[-27px] w-20 lg:w-auto"
              animate={{
                x: trans1().x,
                y: trans1().y,
              }}>
              <Image src={Shape1} alt="decore shape 4 content block" />
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}

export default ContentBlockImage;
