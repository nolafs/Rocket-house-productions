'use client';
import { useUI } from '@rocket-house-productions/hooks';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { BottomShape } from '@rocket-house-productions/ui';
import SectionTitle from '../../section-title/section-title';
import { asText, RichTextField } from '@prismicio/client';
import MottoText from '../../motto-text/motto-text';
import cn from 'classnames';

interface HeroProps {
  data: {
    pageName: string | null | undefined;
    headings: RichTextField | null | undefined;
    subheading: RichTextField | null | undefined;
    text?: string | null | undefined;
    buttons?: any[];
    motto: { text: RichTextField | null | undefined };
    image: any;
  };
  alignment?: 'Left' | 'Right';
  color?: 'A' | 'B';
  decor?: 'A' | 'B';
}

export function HeroCenter({
  data: { headings, subheading, text, buttons, motto, image, pageName },
  alignment = 'Left',
  color = 'B',
  decor = 'A',
}: HeroProps) {
  return (
    <div
      className={cn(
        'hero-area relative pb-[130px] pt-[100px] md:py-[170px] xl:pb-[248px] xl:pt-[270px]',
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
          subtitle={asText(subheading)}
          titleSize={'large'}
          titleClass={cn(color === 'A' && 'text-white')}
        />
        {motto && <MottoText {...motto} size="md" className={cn('mt-[25px]', color === 'A' && 'text-white')} />}
      </motion.div>

      <BottomShape />
    </div>
  );
}

export default HeroCenter;
