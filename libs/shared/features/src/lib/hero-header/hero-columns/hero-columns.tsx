'use client';
import { useUI } from '@rocket-house-productions/hooks';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';
import { PrismicNextImage } from '@prismicio/next';
import MottoText from '../../motto-text/motto-text';
import { GroupField, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import cn from 'classnames';
import Image from 'next/image';
import notes from '../../assets/notes.svg';
import thunder from '../../assets/thunder.svg';
import { ButtonGroup } from '@rocket-house-productions/ui';

interface HeroProps {
  data: {
    pageName: string | null | undefined;
    headings: RichTextField | null | undefined;
    subheading: RichTextField | null | undefined;
    text?: string | null | undefined;
    buttons?: GroupField;
    motto: { text: RichTextField | null | undefined };
    image: any;
  };
  alignment?: 'Left' | 'Right';
  color?: 'A' | 'B';
  decor?: 'A' | 'B';
}

export function HeroColumns({
  data: { headings, subheading, text, buttons, motto, image, pageName },
  alignment = 'Left',
  color = 'A',
  decor = 'A',
}: HeroProps) {
  const { trans1, trans2 } = useUI();

  const colorA = '#2C67DC';
  const colorB = '#F59E0B';

  return (
    <div className="hero-area pt-20 md:pt-24">
      <h1 className="sr-only">{pageName}</h1>
      <div className={cn('gap-7.5 grid lg:grid-cols-2')}>
        <motion.div
          className={cn(
            'self-center text-center md:text-left',
            alignment === 'Left' && 'order-1',
            alignment === 'Right' && 'order-0',
          )}
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.1 }}
          variants={scrollUpVariants}>
          {text && (
            <span
              className={cn(
                'text-primary bg-secondary mb-2 inline-block w-fit rounded-full px-3 py-1 text-sm font-bold uppercase leading-normal tracking-tight md:mb-5',
              )}>
              {text}
            </span>
          )}
          {headings && (
            <h2 className="text-3xl font-bold leading-[1.17] sm:text-4xl lg:text-5xl">
              <PrismicRichText field={headings} />
            </h2>
          )}
          {subheading && (
            <div className="mt-3 text-2xl font-medium leading-[1.17] sm:text-3xl lg:text-4xl">
              <PrismicRichText field={subheading} />
            </div>
          )}
          {motto && <MottoText {...motto} size="md" className="mt-[25px]" />}
          {buttons && (
            <div className={'mt-10 flex justify-center gap-2.5 md:justify-start'}>
              <ButtonGroup buttons={buttons} />
            </div>
          )}
        </motion.div>

        <div className={cn('relative z-10', alignment === 'Left' && 'order-0', alignment === 'Right' && 'order-1')}>
          {image && (
            <motion.div
              className="overflow-hidden"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.1 }}
              variants={scrollUpVariants}>
              <PrismicNextImage
                field={image}
                width={570}
                height={570}
                fallbackAlt=""
                loading={'eager'}
                className={'z-10 w-full max-w-[554px] object-contain'}
                imgixParams={{ fit: 'fill' }}
              />
            </motion.div>
          )}

          <motion.div
            className={cn(
              decor === 'A' && '-z-1 absolute -left-[20%] top-[70px] sm:-left-20 sm:top-[40%]',
              decor === 'B' && 'z-2 absolute -bottom-5 -left-[20%] sm:-left-20 sm:bottom-[10%]',
            )}
            animate={{
              x: trans1().x,
              y: trans1().y,
            }}>
            <svg width="130" height="129" viewBox="0 0 130 129" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_2737_11635" maskUnits="userSpaceOnUse" x="0" y="0" width="129" height="129">
                <circle cx="64.5" cy="64.5" r="63.6103" fill="#C4C4C4" stroke="#F8BB54" strokeWidth="1.77931" />
              </mask>
              <g mask="url(#mask0_2737_11635)">
                <path
                  d="M-37.5059 27.05C-37.5059 27.05 -7.45362 21.4863 0.300235 2.01349C7.71575 -16.6534 38.2625 -21.6709 38.2625 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 36.4092C-37.5059 36.4092 -0.636461 29.9878 8.8606 6.48523C17.9153 -15.9514 55.3571 -21.6709 55.3571 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 45.7947C-37.5059 45.7947 6.15458 38.4892 17.3949 11.009C28.1149 -15.2753 72.4519 -21.6709 72.4519 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 55.1542C-37.5059 55.1542 12.9717 46.9907 25.9553 15.4807C38.3145 -14.5734 89.5466 -21.6709 89.5466 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 64.5136C-37.5059 64.5136 19.7887 55.4922 34.5157 19.9784C48.514 -13.8714 106.615 -21.6709 106.615 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 73.8989C-37.5059 73.8989 26.5798 64.0196 43.05 24.476C58.7396 -13.1955 123.71 -21.6709 123.71 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 83.2584C-37.5059 83.2584 33.3968 72.495 51.6104 28.9738C68.9393 -12.4936 140.805 -21.6709 140.805 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 92.6177C-37.5059 92.6177 40.214 80.9965 60.1447 33.4456C79.1388 -11.7916 157.899 -21.6709 157.899 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 102.003C-37.5059 102.003 47.0049 89.5241 68.705 37.9692C89.3385 -11.1157 174.968 -21.6709 174.968 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 111.362C-37.5059 111.362 53.8221 98.0256 77.2395 42.467C99.538 -10.4138 192.063 -21.6709 192.063 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 120.747C-37.5059 120.747 60.6391 106.527 85.7999 46.9646C109.738 -9.7118 209.157 -21.6709 209.157 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 130.108C-37.5059 130.108 67.4301 115.029 94.3341 51.4625C119.937 -9.03573 226.252 -21.6709 226.252 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 139.466C-37.5059 139.466 74.2472 123.53 102.895 55.934C130.137 -8.33377 243.346 -21.6709 243.346 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 148.851C-37.5059 148.851 81.0643 132.031 111.455 60.4578C140.336 -7.63179 260.416 -21.6709 260.416 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 158.212C-37.5059 158.212 87.8553 140.533 119.989 64.9295C150.536 -6.95592 277.51 -21.6709 277.51 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 167.572C-37.5059 167.572 94.6725 149.034 128.55 69.4272C160.736 -6.25395 294.605 -21.6709 294.605 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 176.957C-37.5059 176.957 101.489 157.561 137.084 73.925C170.935 -5.55198 311.7 -21.6709 311.7 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M-37.5059 186.316C-37.5059 186.316 108.281 166.037 145.644 78.4227C181.135 -4.87612 328.769 -21.6709 328.769 -21.6709"
                  stroke={color === 'B' ? colorB : colorA}
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
              </g>
            </svg>
          </motion.div>
          {decor === 'A' && (
            <motion.div
              className="z-1 absolute -top-4 right-2.5 max-w-[240px] md:right-[20%] md:w-auto"
              animate={{
                x: trans2().x,
                y: trans2().y,
              }}>
              <Image src={notes} width="422" height="360" alt={'notes'} />
            </motion.div>
          )}
          {decor === 'B' && (
            <motion.div
              className="z-1 absolute -top-20 left-2.5 max-w-[180px] md:left-[10%] md:w-auto md:max-w-[240px]"
              animate={{
                x: trans2().x,
                y: trans2().y,
              }}>
              <Image src={thunder} width="240" height="266" alt={'thunder'} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeroColumns;
