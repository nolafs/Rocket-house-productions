import { forwardRef } from 'react';
import cn from 'classnames';
import Anchor from '../anchor/Anchor';
import { BlogPostType, BlogType } from '@rocket-house-productions/types';
import { PrismicNextImage } from '@prismicio/next';

type TProps = Pick<BlogPostType, any> & {
  className?: string;
};

export const BlogCard = forwardRef<HTMLDivElement, TProps>(
  ({ title, publishing_date, category, feature_image, className }, ref) => (
    <div
      className={cn(
        'blog-card relative scale-100 overflow-hidden rounded bg-white transition-all group-hover:scale-[1.02] group-hover:shadow-xl group-hover:shadow-black/5',
        className,
      )}
      ref={ref}
    >
      {feature_image && (
        <figure className="block max-h-[300px] w-full overflow-hidden">
          <PrismicNextImage
            field={feature_image}
            width={500}
            height={300}
            imgixParams={{
              fm: 'webp',
              fit: 'fill',
            }}
            className="h-full w-full object-cover"
          />
        </figure>
      )}

      <div className="px-[30px] py-[25px]">
        <div className="-tracking-tightest text-secondary-light mb-1 block font-medium uppercase">{category}</div>
        <h3 className="group-hover:text-primary mb-0 text-xl leading-normal">{title}</h3>
        <ul className="flex gap-7">
          <li className="text-md mt-3.8">
            <i className="far fa-calendar mr-2.5" />
            {publishing_date}
          </li>
        </ul>
      </div>
    </div>
  ),
);

export default BlogCard;
