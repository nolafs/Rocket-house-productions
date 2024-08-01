import cn from 'classnames';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export interface PageinationProps {
  total: number | undefined;
  currentPage: number | undefined;
  limit?: number | undefined;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export function Pagination({ total = 0, currentPage = 0, limit = 9, prevDisabled, nextDisabled }: PageinationProps) {
  const totalPages = Math.ceil(total / limit);
  currentPage = Math.floor(currentPage / limit);

  const prevPageUrl: any = currentPage === 0 ? 0 : currentPage - 1;
  const nextPageUrl: any = currentPage + 1;

  if (total < limit) {
    return;
  }

  if (currentPage === totalPages - 1) {
    nextDisabled = true;
  }

  if (currentPage === 0) {
    prevDisabled = true;
  }

  if (!totalPages) {
    return null;
  }

  const pageLinks = () => {
    const links: Array<any> = [];

    for (let i = 1; i <= totalPages; i++) {
      links.push(
        <Link
          key={'page=' + i}
          href={`?page=${i - 1}`}
          className={cn(
            currentPage === i - 1
              ? 'text-accent-300 inline-flex items-center text-sm font-semibold'
              : 'inline-flex items-center text-sm font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-200',
          )}>
          {i}
        </Link>,
      );
    }

    return links;
  };

  return (
    <div className="container mx-auto mt-10">
      <nav className="flex flex-row justify-center">
        <div className={'border-primary flex rounded-lg border p-4'}>
          <div className="flex w-10">
            {!prevDisabled && (
              <Link
                href={`?page=${prevPageUrl}`}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-200">
                <ChevronLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" aria-label="previous" />
              </Link>
            )}
          </div>
          <div className="flex w-10 justify-center gap-5">{pageLinks().map(link => link)}</div>
          <div className="flex w-10 justify-end">
            {!nextDisabled && (
              <Link
                href={`?page=${nextPageUrl}`}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-300">
                <ChevronRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" aria-label="next" />
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Pagination;
