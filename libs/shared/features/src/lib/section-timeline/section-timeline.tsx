'use client';
import SectionTitle from '../section-title/section-title';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import SectionTimelineItem from './section-timeline-item';

const AnimatedSectionTitle = motion(SectionTitle);

type SectionTimelineProps = {
  data: {
    title?: any;
    category?: any;
    items?: any[];
  };
};

export function SectionTimeline({ data: { title, category, items } }: SectionTimelineProps) {
  return (
    <div className="container">
      {title && (
        <AnimatedSectionTitle
          title={title}
          subtitle={category}
          titleSize="large"
          className="mb-7.5 md:mb-15"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.4 }}
          variants={scrollUpVariants}
        />
      )}
      {items && items.length > 0 && (
        <ul className="relative pb-[65px] pt-8">
          <li className="left-3.8 border-l-mishcka absolute top-0 -ml-px h-full border-l-2 md:left-1/2" />
          {items.map(({ heading, title, image, body }, idx) => (
            <SectionTimelineItem
              key={('timeline' + idx).replace(/\s/g, '-').toLowerCase()}
              title={title}
              image={image}
              body={body}
              heading={heading}
              isEven={idx % 2 === 0}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default SectionTimeline;
