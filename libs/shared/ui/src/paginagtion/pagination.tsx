'use client';
import cn from 'classnames';
import Link from 'next/link';

export interface PageinationProps {
  total: number | undefined;
  currentPage: number | undefined;
  limit?: number | undefined;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

export function Pagination({ total = 0, currentPage = 0, limit = 9, prevDisabled, nextDisabled }: PageinationProps) {
  const totalPages = total;

  const prevPageUrl: any = currentPage === 0 ? 0 : currentPage - 1;
  const nextPageUrl: any = currentPage + 1;

  if (total < limit) {
    return;
  }

  if (currentPage === totalPages) {
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
          href={`/blog?page=${i}`}
          className={cn(
            'text-md border-l border-l-gray-200 px-5 py-2',
            currentPage === i
              ? 'text-primary inline-flex items-center bg-gray-100/50 font-semibold'
              : 'inline-flex items-center font-semibold text-gray-500 hover:border-gray-300 hover:text-gray-200',
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
        <div className={'flex rounded-md border border-gray-200'}>
          <div className={'p-3'}>
            {!prevDisabled && (
              <Link
                href={`/blog?page=${prevPageUrl}`}
                className="text-md inline-flex items-center font-medium text-gray-500 hover:border-gray-300 hover:text-gray-200">
                Previous
              </Link>
            )}
          </div>
          <div className="flex justify-center">{pageLinks().map(link => link)}</div>
          <div className="flex justify-end border-l border-l-gray-200 p-3">
            {!nextDisabled && (
              <Link
                href={`/blog?page=${nextPageUrl}`}
                className="text-md inline-flex items-center font-medium text-gray-500 hover:border-gray-300 hover:text-gray-300">
                Next
              </Link>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Pagination;
