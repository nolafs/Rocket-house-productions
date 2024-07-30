'use client';
import { useUI } from '@rocket-house-productions/hooks';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { BottomShape, ButtonGroup } from '@rocket-house-productions/ui';
import SectionTitle from '../../section-title/section-title';
import { RichTextField } from '@prismicio/client';
import MottoText from '../../motto-text/motto-text';
import cn from 'classnames';
import { PrismicLink } from '@prismicio/react';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
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
        'hero-area mb-15 relative z-10 pt-[140px] md:mb-[200px]',
        color === 'A' ? 'bg-primary' : 'bg-neutral',
      )}>
      <h1 className="sr-only">Home Page</h1>
      <motion.div
        className="container mx-auto max-w-3xl text-center"
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

        {video && (
          <motion.div
            className="-bottom-15 -mt-15 relative z-10 md:-bottom-[140px] md:-mt-[140px]"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.4 }}
            variants={scrollUpVariants}>
            <div className="shadow-xxl group relative z-20 overflow-hidden rounded-lg shadow-black/[22%]">
              <VideoPlayer {...video} />
            </div>
          </motion.div>
        )}
      </motion.div>
      <BottomShape />
      <div className=""></div>
    </div>
  );
}

export default HeroCenter;
