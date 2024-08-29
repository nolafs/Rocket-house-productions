import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';

/**
 * Props for `ImageGrid`.
 */
export type ImageGridProps = SliceComponentProps<Content.ImageGridSlice>;

/**
 * Component for "ImageGrid" Slices.
 */
const ImageGrid = ({ slice }: ImageGridProps): JSX.Element => {
  return (
    <section data-slice-type={slice.slice_type} data-slice-variation={slice.variation}>
      <div
        className={`grid grid-cols-1 gap-4 sm:grid-cols-${slice.primary.no_columns_small || 1} md:grid-cols-${slice.primary.no_columns_medium || 2} lg:grid-cols-${slice.primary.no_columns_large || 3}`}>
        {slice.primary.items.map((item, index) => {
          return (
            <div key={index} className="relative">
              <PrismicNextImage field={item.image} className="h-full w-full object-cover" />
              {item.caption && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <p className="text-center text-white">{item.caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ImageGrid;
