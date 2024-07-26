'use client';
import {motion} from "framer-motion";
import {useUI} from '@rocket-house-productions/hooks';
import SectionTitle from '../section-title/section-title';
import MottoText from '../motto-text/motto-text';
import {scrollUpVariants} from '@rocket-house-productions/util';
import {MottoType, SectionTitleType} from '@rocket-house-productions/types';

interface ContentBlockImageProps {
  data: {
    section_title: SectionTitleType,
    motto: MottoType,
    images: any[]
  }
  titleSize?: 'default' | 'large' | undefined

}


export function ContentBlockImage(
  {
    data: {
      section_title,
      motto,
      images
    },
    titleSize
  }: ContentBlockImageProps
) {

  const {trans1} = useUI();

  return (
    <div className="container grid lg:grid-cols-2 items-center gap-[50px] lg:gap-7.5">
      <motion.div
        className="lg:max-w-[420px] order-2 lg:order-1"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{once: true, amount: 0.1}}
        variants={scrollUpVariants}
      >
        {section_title && (
          <SectionTitle
            {...section_title}
            align="left"
            titleSize={titleSize}
          />
        )}
        {motto && (
          <MottoText className="mt-4" size="md" {...motto} />
        )}
      </motion.div>
      <div className="relative order-1 lg:order-2">
        {images?.[0]?.src && (
          <motion.div
            className="relative z-10"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{once: true, amount: 0.1}}
            variants={scrollUpVariants}
          >
            <img
              src={images[0].src}
              alt={images[0]?.alt || "About One"}
              width={570}
              height={360}
              loading="lazy"
              className="rounded"
            />
          </motion.div>
        )}
        {images?.[1]?.src && (
          <div className="absolute z-20 top-[-90px] right-0 3xl:right-[-73px]">
            <img
              src={images[1].src}
              alt={images[1]?.alt || "About Two"}
              width={190}
              height={190}
              loading="lazy"
              className="rounded"
            />
          </div>
        )}

        <motion.div
          className="absolute z-1 top-[-51px] left-0 lg:left-[-107px]"
          animate={{
            x: trans1().x,
            y: trans1().y,
          }}
        >
                        <span
                          className="block -indent-[99999px] border-[7px] border-desert rounded-full w-[45px] h-[45px] lg:w-15 lg:h-15">
                            shape 1
                        </span>
        </motion.div>
        <motion.div
          className="absolute z-1 bottom-[-26px] w-20 left-0 lg:w-auto lg:-left-10"
          animate={{
            x: trans1().x,
            y: trans1().y,
          }}
        >
          <img
            src="/images/shape-animation/about-shape-1.png"
            alt=""
          />
        </motion.div>
        <motion.div
          className="absolute z-1 right-2.5 -bottom-10 w-20 lg:w-auto"
          animate={{
            x: trans1().x,
            y: trans1().y,
          }}
        >
          <img
            src="/images/shape-animation/nwesletter-shape-2.png"
            alt=""
          />
        </motion.div>
        <motion.div
          className="absolute z-1 top-[-27px] left-[360px] w-20 lg:w-auto"
          animate={{
            x: trans1().x,
            y: trans1().y,
          }}
        >
          <img src="/images/shape-animation/shape-1.png" alt=""/>
        </motion.div>
      </div>
    </div>
  );
}

export default ContentBlockImage;
