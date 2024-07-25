import {Anchor} from '@rocket-house-productions/ui';
import cn from 'classnames';


type TProps = {
  className?: string;
  pages: Array<{
    path: string;
    label: string;
  }>;
  currentPage: string;
  showTitle?: boolean;
  title?: string;
};

export function Breadcrumb(
  {
    className,
    pages,
    currentPage,
    showTitle,
    title,
  }: TProps
) {

  return (
    <div
      className={cn(
        "page-title-area relative",
        showTitle &&
        "pt-15 pb-5 md:pt-10 md:pb-5 lg:pt-[100px] lg:pb-10",
        !showTitle && "pb-10 md:pb-5 lg:pb-10",
        className
      )}
    >
      {showTitle && (
        <div className="container mx-auto">
          <h1 className="title capitalize mt-5 mb-0 text-3xl md:text-4xl lg:text-5xl text-center">
            {title || currentPage}
          </h1>
        </div>
      )}
      {!showTitle && (
        <h1 className="sr-only">{title || currentPage}</h1>
      )}

      <div
        className={cn(
          "page-breadcrumb top-0 left-0 w-full",
          showTitle && "absolute"
        )}
      >
        <nav className="container mx-auto" aria-label="breadcrumbs">
          <ul className="breadcrumb flex flex-wrap py-3">
            {pages.map(({path, label}) => (
              <li
                key={label}
                className="text-md text-bold first:before:hidden before:content-['/'] before:mx-3.8 before:color-body"
              >
                <Anchor
                  path={path}
                  className="text-primary capitalize relative before:absolute before:content-[''] before:-bottom-1.5 before:right-0 before:w-0 before:h-px before:transition-all before:bg-heading hover:text-heading hover:before:left-0 hover:before:w-full"
                >
                  {label}
                </Anchor>
              </li>
            ))}

            <li
              className="text-md capitalize text-heading first:before:hidden before:content-['/'] before:mx-3.8 before:color-body"
              aria-current="page"
            >
              {currentPage}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );

}

export default Breadcrumb;
