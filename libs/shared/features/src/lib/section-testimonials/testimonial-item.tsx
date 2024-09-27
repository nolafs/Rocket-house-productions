'use client';
import cn from 'classnames';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { TestimonialsType } from '@rocket-house-productions/types';

export function TestimonialItem({ name, designation, review, image }: TestimonialsType) {
  return (
    <div
      className={cn(
        'testimonial shadow-dark/10 flex h-full flex-col flex-wrap rounded bg-white px-5 py-6 shadow-md md:py-10 lg:px-7 lg:py-8',
      )}>
      {image?.src && (
        <figure className="image flex-auto0 w-[70px]">
          <PrismicNextImage
            field={image}
            width={70}
            height={70}
            fallbackAlt=""
            imgixParams={{ fm: 'webp', fit: 'crop' }}
            className={'rounded-full'}
          />
        </figure>
      )}

      <div className="content w-full flex-auto pt-5 md:w-[calc(100%_-_70px)] md:pl-[30px] md:pt-0">
        <p className="mb-6 text-base font-medium leading-relaxed md:mb-[34px] lg:text-lg">
          <PrismicRichText field={review} />
        </p>
        <h3 className="text-h6 mb-0 uppercase tracking-wider">{name}</h3>
        <span className="lg:text-md mt-2 block text-gray-300 md:mt-[11px]">{designation}</span>
      </div>
    </div>
  );
}

export default TestimonialItem;
