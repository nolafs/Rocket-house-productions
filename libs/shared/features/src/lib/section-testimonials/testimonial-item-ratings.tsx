'use client';
import cn from 'classnames';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import { StarRating } from '@rocket-house-productions/ui';
import { TestimonialsType } from '@rocket-house-productions/types';

export function TestimonialRatingItem({ name, designation, review, image, rating }: TestimonialsType) {
  return (
    <div
      className={cn(
        'testimonial shadow-2sm shadow-dark/10 my-10 flex h-full flex-1 flex-col flex-wrap justify-items-stretch rounded bg-white px-9 pb-5 pt-5 lg:px-[50px] lg:pb-[47px] lg:pt-[31px]',
      )}>
      <div className="mb-5 flex w-full shrink">
        {image && (
          <figure className="image w-[90px] shrink">
            <PrismicNextImage
              field={image}
              width={90}
              height={90}
              fallbackAlt=""
              imgixParams={{ fit: 'crop' }}
              className={'rounded-full'}
            />
          </figure>
        )}
        <div className="pl-7.5 grow">
          <StarRating rating={rating} align="left" className="mb-[11px]" />
          <div className={'flex flex-col md:flex-row'}>
            <h3 className="text-lg font-extrabold">{name}</h3>
            <span className="text-sm text-gray-300 md:ml-3.5 md:text-lg">
              <span className={'hidden md:inline-block'}>/</span> {designation}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex-auto font-medium leading-relaxed md:mb-[34px] md:text-lg">
        <PrismicRichText field={review} />
      </div>
    </div>
  );
}

export default TestimonialRatingItem;
