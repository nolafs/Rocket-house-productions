'use client';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';

import TestimonialItemRatings from './testimonial-item-ratings';

export type TestimonialsItemType = {
  name: string;
  designation: string;
  review: any;
  image: any;
  rating?: number;
};

interface SectionTestimonialsProps {
  data: TestimonialsItemType[];
  className?: string;
  variant?: 'default' | 'ratings';
}

export function SectionTestimonials({ data, className }: SectionTestimonialsProps) {
  return (
    <div className={'container'}>
      <Swiper
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        autoHeight={true}
        navigation={{
          nextEl: '.swiper-button-next-custom',
          prevEl: '.swiper-button-prev-custom',
        }}
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
              <SwiperSlide className={'px-5'} key={(item.name + idx).replace(/\s/g, '-').toLowerCase()}>
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
