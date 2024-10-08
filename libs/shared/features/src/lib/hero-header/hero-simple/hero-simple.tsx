'use client';

import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';

import SectionTitle from '../../section-title/section-title';
import { KeyTextField, RichTextField } from '@prismicio/client';
import cn from 'classnames';

interface HeroSimpleProps {
  data: {
    pageName: KeyTextField | string | null | undefined;
    heading?: RichTextField | null | undefined;
    text?: KeyTextField | string | null | undefined;
  };
  color?: 'A' | 'B';
}

export function HeroSimple({ data: { heading, text, pageName }, color = 'B' }: HeroSimpleProps) {
  return (
    <header className={'z-10 mb-10 px-5 pt-[100px] md:mb-24 md:pt-[140px]'}>
      <h1 className="sr-only">{pageName}</h1>
      <motion.div
        className="container z-10 mx-auto max-w-[930px] text-center"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.1 }}
        variants={scrollUpVariants}>
        <SectionTitle
          title={heading}
          subtitle={text}
          titleSize={'large'}
          titleClass={cn(color === 'A' && 'text-white')}
        />
      </motion.div>
    </header>
  );
}

export default HeroSimple;
