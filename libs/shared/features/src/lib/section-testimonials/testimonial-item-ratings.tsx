'use client';
import cn from 'classnames';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { StarRating } from '@rocket-house-productions/ui';
import { TestimonialsItemType } from './section-testimonials';

export function TestimonialRatingItem({ name, designation, review, image, rating }: TestimonialsItemType) {
  return (
    <div
      className={cn(
        'testimonial shadow-2sm shadow-dark/10 my-10 flex h-full flex-row flex-wrap justify-items-stretch rounded bg-white px-[50px] pb-[47px] pt-[31px]',
      )}>
      <div className="mb-5 flex w-full">
        {image && (
          <figure className="image w-[90px] shrink">
            <PrismicNextImage
              field={image}
              width={90}
              height={90}
              imgixParams={{ fit: 'crop' }}
              className={'rounded-full'}
            />
          </figure>
        )}
        <div className="pl-7.5 grow">
          <StarRating rating={rating} align="left" className="mb-[11px]" />
          <div className={'flex'}>
            <h3 className="text-lg font-extrabold">{name}</h3>
            <span className="ml-3.5 text-lg text-gray-300">/ {designation}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 text-lg font-medium leading-relaxed md:mb-[34px]">
        <PrismicRichText field={review} />
      </div>
    </div>
  );
}

export default TestimonialRatingItem;
