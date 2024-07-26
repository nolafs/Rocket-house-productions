import {forwardRef} from 'react';
import cn from 'classnames';
import {Anchor} from '@rocket-house-productions/ui';
import {RichTextField} from '@prismicio/client';
import {PrismicRichText} from '@prismicio/react';

type TProps = {
  text?: RichTextField | null | undefined;
  path?: string | null | undefined;
  pathText?: string | null | undefined;
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
      <Anchor
        path={path}
        className={cn(
          "font-bold leading-none relative py-[3px] text-primary",
          "before:absolute before:content-[''] before:w-full before:scale-x-100 before:origin-right before:bg-gray-350 before:transition-transform before:duration-600 before:delay-300 before:ease-in-expo before:bottom-0 before:left-0 before:h-px",
          "after:absolute after:content-[''] after:w-full after:scale-x-0 after:origin-left after:bg-primary after:transition-transform after:duration-600 after:delay-75 after:ease-in-expo after:bottom-0 after:left-0 after:h-px",
          "hover:before:scale-x-0 hover:after:scale-x-100 hover:after:delay-300 hover:before:delay-75"
        )}
      >
        {pathText} <i className="fas fa-arrow-right"/>
      </Anchor>
    </p>
  )
);
export default MottoText;
