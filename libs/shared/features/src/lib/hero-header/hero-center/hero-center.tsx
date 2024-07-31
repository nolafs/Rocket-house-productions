'use client';
import { useUI } from '@rocket-house-productions/hooks';
import { motion } from 'framer-motion';
import { fadeIn, scrollUpFadeVariants, scrollUpVariants } from '@rocket-house-productions/util';
import { BottomShape, ButtonGroup } from '@rocket-house-productions/ui';
import SectionTitle from '../../section-title/section-title';
import { RichTextField } from '@prismicio/client';
import MottoText from '../../motto-text/motto-text';
import cn from 'classnames';

import Image from 'next/image';
import Notes from '../../assets/notes.png';
import VideoPlayer from '../../video-player/video-player';

interface HeroProps {
  data: {
    pageName: string | null | undefined;
    headings: RichTextField | null | undefined;
    text?: string | null | undefined;
    buttons?: any[];
    motto: { text: RichTextField | null | undefined };
    image: any;
    video: any;
  };
  alignment?: 'Left' | 'Right';
  color?: 'A' | 'B';
  decor?: 'A' | 'B';
}

export function HeroCenter({
  data: { headings, text, buttons, motto, image, pageName, video },
  alignment = 'Left',
  color = 'B',
  decor = 'A',
}: HeroProps) {
  return (
    <div
      className={cn(
        'hero-area mb-15 relative isolate z-10 pt-[140px] md:mb-[200px]',
        color === 'A' ? 'bg-primary' : 'bg-neutral',
      )}>
      <h1 className="sr-only">Home Page</h1>
      {decor === 'A' && (
        <motion.div
          className="absolute left-1/2 top-[30%] z-50 h-full max-h-[447px] w-full max-w-[1100px] -translate-x-1/2"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={scrollUpFadeVariants}>
          <Image src={Notes} alt="notes decor" quality={100} className={'h-full w-full object-contain'} />
        </motion.div>
      )}
      <motion.div
        className="container z-10 mx-auto max-w-3xl text-center"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={scrollUpVariants}>
        <SectionTitle
          title={headings}
          subtitle={text}
          titleSize={'large'}
          titleClass={cn(color === 'A' && 'text-white')}
        />
        {motto && <MottoText {...motto} size="md" className={cn('mt-[25px]', color === 'A' && 'text-white')} />}

        {buttons && (
          <div className={'mb-16 mt-10 flex justify-center gap-2.5'}>
            <ButtonGroup buttons={buttons} />
          </div>
        )}
      </motion.div>
      {video && (
        <motion.div
          className="-bottom-15 -mt-15 container relative z-10 mx-auto max-w-[944px] md:-bottom-[140px] md:-mt-[140px]"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.4 }}
          variants={scrollUpVariants}>
          <div className="shadow-xxl group relative overflow-hidden rounded-lg shadow-black/[22%]">
            <VideoPlayer image={image} {...video} />
          </div>
        </motion.div>
      )}

      <BottomShape />
    </div>
  );
}

export default HeroCenter;
