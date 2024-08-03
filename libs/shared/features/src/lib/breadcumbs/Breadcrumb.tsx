import { Anchor } from '@rocket-house-productions/ui';
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

export function Breadcrumb({ className, pages, currentPage, showTitle, title }: TProps) {
  return (
    <div
      className={cn(
        'page-title-area relative',
        showTitle && 'pt-15 pb-5 md:pb-5 md:pt-10 lg:pb-10 lg:pt-[100px]',
        !showTitle && 'pb-10 md:pb-5 lg:pb-10',
        className,
      )}
    >
      {showTitle && (
        <div className="container mx-auto">
          <h1 className="title mb-0 mt-5 text-center text-3xl capitalize md:text-4xl lg:text-5xl">
            {title || currentPage}
          </h1>
        </div>
      )}
      {!showTitle && <h1 className="sr-only">{title || currentPage}</h1>}

      <div className={cn('page-breadcrumb left-0 top-0 w-full', showTitle && 'absolute')}>
        <nav className="container mx-auto" aria-label="breadcrumbs">
          <ul className="breadcrumb flex flex-wrap py-3">
            {pages.map(({ path, label }) => (
              <li
                key={label}
                className="text-md text-bold before:mx-3.8 before:color-body before:content-['/'] first:before:hidden"
              >
                <Anchor
                  path={path}
                  className="text-primary before:bg-heading hover:text-heading relative capitalize before:absolute before:-bottom-1.5 before:right-0 before:h-px before:w-0 before:transition-all before:content-[''] hover:before:left-0 hover:before:w-full"
                >
                  {label}
                </Anchor>
              </li>
            ))}

            <li
              className="text-md text-heading before:mx-3.8 before:color-body capitalize before:content-['/'] first:before:hidden"
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
