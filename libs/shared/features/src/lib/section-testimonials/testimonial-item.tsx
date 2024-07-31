'use client';
import { TestimonialsItem } from '@rocket-house-productions/features';
import cn from 'classnames';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

export function TestimonialItem({ name, designation, review, image }: TestimonialsItem) {
  return (
    <div
      className={cn('testimonial shadow-dark/10 flex h-full flex-wrap rounded bg-white px-7 py-8 shadow-md md:py-10')}>
      {image?.src && (
        <figure className="image flex-auto0 w-[70px]">
          <PrismicNextImage field={image} width={70} height={70} className={'rounded-full'} />
        </figure>
      )}

      <div className="content flex-auto0 w-full pt-5 md:w-[calc(100%_-_70px)] md:pl-[30px] md:pt-0">
        <p className="mb-6 text-lg font-medium leading-relaxed md:mb-[34px]">
          <PrismicRichText field={review} />
        </p>
        <h3 className="text-h6 mb-0 uppercase tracking-wider">{name}</h3>
        <span className="text-md mt-2 block text-gray-300 md:mt-[11px]">{designation}</span>
      </div>
    </div>
  );
}

export default TestimonialItem;
