'use client';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { motion } from 'framer-motion';
import StatsItem from './stats-item';
import SectionTitle from '../section-title/section-title';

const AnimatedSectionTitle = motion(SectionTitle);
const AnimatedStatsFact = motion(StatsItem);

type SectionStatsProps = {
  data: {
    title?: any;
    category?: any;
    body?: any;
    items?: any[];
  };
};

export function SectionStats({ data: { title, category, body, items } }: SectionStatsProps) {
  return (
    <div>
      {title && (
        <AnimatedSectionTitle
          title={title}
          subtitle={category}
          description={body}
          titleSize="large"
          className="mb-7.5 md:mb-15"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.4 }}
          variants={scrollUpVariants}
        />
      )}
      <div className="mx-auto grid gap-[30px] md:grid-cols-4">
        {items?.map(
          item =>
            (item.counter || item.title) && (
              <AnimatedStatsFact
                key={item.title.replace(/\s/g, '-').toLowerCase()}
                counter={Number(item.counter)}
                suffix={item.suffix}
                title={item.title}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, amount: 0.4 }}
                variants={scrollUpVariants}
              />
            ),
        )}
      </div>
    </div>
  );
}

export default SectionStats;
