import { forwardRef } from 'react';
import cn from 'classnames';
import { BlogPostType } from '@rocket-house-productions/types';
import { PrismicNextImage } from '@prismicio/next';
import placeholder from '../assets/placeholder.png';
import Image from 'next/image';
import { CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
type TProps = Pick<BlogPostType, any> & {
  className?: string;
};

const publishDateFormatted = (publishDate: string) => {
  return dayjs(publishDate).format('MMMM D, YYYY');
};

export const BlogCard = forwardRef<HTMLDivElement, TProps>(
  ({ title, publishing_date, first_publication_date, category, feature_image, className }, ref) => (
    <div
      className={cn(
        'blog-card relative flex h-full scale-100 flex-col justify-items-stretch overflow-hidden rounded bg-white transition-all group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/5',
        className,
      )}
      ref={ref}>
      {feature_image && (
        <figure className="relative isolate block max-h-[300px] w-full overflow-hidden">
          <PrismicNextImage
            field={feature_image}
            width={500}
            height={300}
            fill
            fallbackAlt=""
            imgixParams={{
              fm: 'webp',
              fit: 'fill',
              crop: ['focalpoint'],
              w: 500,
              h: 300,
            }}
            className="z-1 h-full w-full object-cover"
          />
          <Image src={placeholder} width={500} height={300} alt={'placeholder image'} className={'relative -z-0'} />
        </figure>
      )}

      <div className="flex grow flex-col justify-items-stretch px-[30px] py-[25px]">
        <div className="text-primary text-sm font-semibold uppercase leading-tight">{category.slug}</div>
        <h3 className="group-hover:text-primary mb-5 grow text-2xl font-bold leading-tight">{title}</h3>
        <div className="flex shrink items-center gap-2 text-sm font-semibold text-gray-400">
          <i>
            <CalendarIcon width={24} height={24} />
          </i>
          <time dateTime={publishing_date || first_publication_date}>
            {publishDateFormatted(publishing_date || first_publication_date)}
          </time>
        </div>
      </div>
    </div>
  ),
);

export default BlogCard;
