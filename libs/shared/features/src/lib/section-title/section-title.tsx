import {forwardRef} from 'react';
import cn from 'classnames';
import {PrismicRichText} from '@prismicio/react';
import {RichTextField} from '@prismicio/client';

type TProps = {
  className?: string;
  title: RichTextField | null | undefined;
  subtitle?: string | null | undefined;
  description?: RichTextField | null | undefined;
  align?: "left" | "right" | "center";
  color?: "A" | "B" | "C";
  titleSize?: "default" | "large";
  subtitleClass?: string;
  titleClass?: string;
  descClass?: string;
};


export const SectionTitle = forwardRef<HTMLDivElement, TProps>(
  (
    {
      className,
      title,
      subtitle,
      description,
      align = 'center',
      color= 'A',
      titleSize,
      subtitleClass,
      titleClass,
      descClass,
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          "section-title relative z-20",
          align === "center" && "text-center",
          className
        )}
        ref={ref}
      >
        {subtitle && (
          <span
            className={cn(
              "relative font-bold w-auto text-base  px-3 py-1  mb-2.5 rounded-full",
              color === "A" && "text-primary bg-secondary",
              color === "B" && "text-secondary",
              subtitleClass
            )}

            dangerouslySetInnerHTML={{__html: subtitle}}
          />
        )}

        <h2
          className={cn(
            "title m-0 child:text-primary child:font-normal",
            color === "A" && "text-gray-900",
            color === "C" && "text-primary",
            titleSize === "large" &&
            "font-bold text-4xl lg:text-5xl leading-heading lg:leading-heading",
            titleClass
          )}

        >
          <PrismicRichText field={title}/>
        </h2>

        {description && (
          <div
            className={cn(
              "mb-0 mt-[25px] font-medium",
              descClass,
              color === "C" && "text-primary"
            )}

          >
            <PrismicRichText field={description}/>
          </div>
        )}
      </div>
    );
  }
);



export default SectionTitle;
