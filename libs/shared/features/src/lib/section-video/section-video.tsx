'use client';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { BottomShape } from '@rocket-house-productions/ui';
import SectionTitle from '../section-title/section-title';
import { RichTextField } from '@prismicio/client';
import MottoText from '../motto-text/motto-text';
import cn from 'classnames';
import VideoPlayer from '../video-player/video-player';

interface SectionVideoProps {
  data: {
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

export function SectionVideo({
  data: { headings, text, buttons, motto, image, video },
  alignment = 'Left',
  color = 'B',
  decor = 'A',
}: SectionVideoProps) {
  return (
    <div
      className={cn(
        'section-area mb-15 relative z-10 px-5 pt-24 md:mb-36',
        color === 'A' ? 'bg-primary' : 'bg-accent/60',
      )}>
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
          color={'C'}
          titleClass={cn(color === 'A' && 'text-white')}
        />
        {motto && <MottoText {...motto} size="md" className={cn('mb-16 mt-[25px]', color === 'A' && 'text-white')} />}

        {video && (
          <div className="-bottom-15 -mt-15 relative z-10 md:-bottom-[140px] md:-mt-[140px]">
            <div className="shadow-xxl group relative z-20 overflow-hidden rounded-lg shadow-black/[22%]">
              <VideoPlayer image={image} {...video} />
            </div>
          </div>
        )}
      </motion.div>
      <BottomShape />
    </div>
  );
}

export default SectionVideo;
