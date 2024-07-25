import {forwardRef} from 'react';
import cn from 'classnames';
import Anchor from '../anchor/Anchor';
import {BlogPostType, BlogType} from '@rocket-house-productions/types';
import {PrismicNextImage} from '@prismicio/next';



type TProps = Pick<BlogPostType, any>  &{
  className?: string;
}

export const BlogCard = forwardRef<HTMLDivElement, TProps>(
  ({title, publishing_date, category, feature_image,  className}, ref) => (
    <div
      className={cn(
        "blog-card relative overflow-hidden transition-all rounded bg-white scale-100 group-hover:shadow-xl group-hover:shadow-black/5 group-hover:scale-[1.02]",
        className
      )}
      ref={ref}
    >
      {feature_image && (
        <figure className="block w-full max-h-[300px] overflow-hidden">
          <PrismicNextImage field={feature_image}
                            width={500}
                            height={300}
                            imgixParams={{
                              fm: 'webp',
                              fit: 'fill',
                            }}
                            className="w-full h-full object-cover"

          />
        </figure>
      )}

      <div className="py-[25px] px-[30px]">
        <div
          className="font-medium block mb-1 -tracking-tightest uppercase text-secondary-light"
        >
          {category}
        </div>
        <h3 className="text-xl mb-0 leading-normal group-hover:text-primary">
          {title}
        </h3>
        <ul className="flex gap-7">
          <li className="text-md mt-3.8">
            <i className="far fa-calendar mr-2.5"/>
            {publishing_date}
          </li>
        </ul>
      </div>
    </div>
  )
);

export default BlogCard;
