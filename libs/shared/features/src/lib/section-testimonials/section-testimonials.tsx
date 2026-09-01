'use client';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import TestimonialItemRatings from './testimonial-item-ratings';
import { TestimonialsType } from '@rocket-house-productions/types';

interface SectionTestimonialsProps {
  data: TestimonialsType[];
  className?: string;
  variant?: 'default' | 'ratings';
}

export function SectionTestimonials({ data, className }: SectionTestimonialsProps) {
  return (
    <div className={'container [&_.swiper-pagination]:mt-8 [&_.swiper-pagination-bullet]:h-3 [&_.swiper-pagination-bullet]:w-3 [&_.swiper-pagination]:relative [&_.swiper-pagination]:block [&_.swiper-pagination-bullet-active]:bg-primary'}>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        autoHeight={true}
        pagination={{ clickable: true }}
        loop={true}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          992: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
        }}>
        {data.map(
          (item, idx) =>
            item.name && (
              <SwiperSlide
                className={'!inline-flex !h-full flex-col px-5'}
                key={(item.name + idx).replace(/\s/g, '-').toLowerCase()}>
                <TestimonialItemRatings
                  name={item.name}
                  designation={item.designation}
                  review={item.review}
                  image={item.image}
                  rating={item.rating}
                />
              </SwiperSlide>
            ),
        )}
      </Swiper>
    </div>
  );
}

export default SectionTestimonials;
