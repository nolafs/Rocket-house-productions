'use client';
import { useUI } from '@rocket-house-productions/hooks';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { PrismicNextImage } from '@prismicio/next';
import MottoText from '../../motto-text/motto-text';

import { Button } from '@rocket-house-productions/ui';

interface HeroColumnsProps {
  data: {
    headings: { content: string }[];
    texts: { id: string; content: string }[];
    buttons: { id: string; content: string; icon: string }[];
    motto: { text: string };
    image: any;
  };
}

export function HeroColumns({ data: { headings, texts, buttons, motto, image } }: HeroColumnsProps) {
  const { trans1, trans2 } = useUI();
  return (
    <div className="hero-area pt-[65px]">
      <div className="gap-7.5 container grid lg:grid-cols-2">
        <motion.div
          className="self-center text-center md:max-w-[460px] md:text-left"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={scrollUpVariants}>
          {headings?.[0]?.content && (
            <h1 className="text-secondary text-3xl leading-[1.17] sm:text-4xl lg:text-5xl">{headings[0].content}</h1>
          )}
          {texts?.map(text => (
            <p
              key={text.id}
              className="text-md text-secondary-light mt-3 font-medium leading-relaxed sm:text-[16px] lg:text-lg">
              {text.content}
            </p>
          ))}

          {buttons?.map(({ id, content, icon, ...rest }) => (
            <Button key={id} className="mt-5" {...rest}>
              {content}
            </Button>
          ))}
          {motto && <MottoText {...motto} size="md" className="mt-[25px]" />}
        </motion.div>

        <div className="relative z-10">
          {image && (
            <motion.div
              className="overflow-hidden rounded-full"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              variants={scrollUpVariants}>
              <PrismicNextImage field={image} width={570} height={570} alt="" imgixParams={{ fit: 'fill' }} />
            </motion.div>
          )}

          <motion.div
            className="-z-1 absolute left-px top-0 h-20 w-20 sm:top-[124px] sm:h-[100px] sm:w-[100px] md:left-px md:h-auto md:w-auto"
            animate={{
              x: trans1().x,
              y: trans1().y,
            }}>
            <span data-depth="3">
              <img src="/images/shape-animation/about-shape-1.png" alt="" />
            </span>
          </motion.div>

          <motion.div
            className="-z-1 absolute left-px top-[70px] h-20 w-20 sm:top-[262px] sm:h-[100px] sm:w-[100px] md:left-px md:h-auto md:w-auto"
            animate={{
              x: trans2().x,
              y: trans2().y,
            }}>
            <img src="/images/shape-animation/about-shape-1.png" alt="" />
          </motion.div>
          <motion.div
            className="absolute left-2 top-[255px] z-20 sm:-left-2 sm:top-[355px]"
            animate={{
              x: trans1().x,
              y: trans1().y,
            }}>
            <span className="border-desert block h-[42px] w-[42px] rounded-full border-[6px] -indent-[99999px] md:h-[62px] md:w-[62px] md:border-8">
              shape 3
            </span>
          </motion.div>
          <motion.div
            className="-z-1 bottom-3.8 absolute right-5 w-[100px] sm:bottom-[55px] sm:right-[45px] sm:w-[100px] md:w-auto"
            animate={{
              x: trans1().x,
              y: trans1().y,
            }}>
            <img src="/images/shape-animation/shape-1.png" alt="" />
          </motion.div>
          <motion.div
            className="z-1 w-15 sm:right-7.5 absolute bottom-[140px] right-2.5 sm:bottom-[314px] md:right-[70px] md:w-auto"
            animate={{
              x: trans1().x,
              y: trans1().y,
            }}>
            <img src="/images/shape-animation/nwesletter-shape-2.png" alt="" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HeroColumns;
