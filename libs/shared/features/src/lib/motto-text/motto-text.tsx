import {forwardRef} from 'react';
import cn from 'classnames';
import {Anchor} from '@rocket-house-productions/ui';
import {RichTextField} from '@prismicio/client';
import {PrismicRichText} from '@prismicio/react';

type TProps = {
  text?: any | RichTextField | null | undefined;
  path?: string | null | undefined;
  pathText?: any | null | undefined;
  className?: string;
  size?: "md" | "lg";
};


const MottoText = forwardRef<HTMLParagraphElement, TProps>(
  ({text, pathText, path, className, size}, ref) => (
    <p
      className={cn(
        "font-medium text-gray-500 leading-relaxed",
        size === "md" && "text-base",
        size === "lg" && "text-lg",
        className
      )}
      ref={ref}
    >
      <PrismicRichText field={text} /> {" "}
      {/* Link block here */}
    </p>
  )
);
export default MottoText;
