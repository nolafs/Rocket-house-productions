import { RichTextField } from '@prismicio/client';
import { PrismicLink, PrismicRichText } from '@prismicio/react';
import MottoText from '../motto-text/motto-text';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

interface HeroColumnsProps {
  data: {
    headings: RichTextField | null | undefined;
    buttons?: any[];
    motto: { text: RichTextField | null | undefined };
  };
  color?: 'A' | 'B';
}

export function CtaTwoColumn({ data: { headings, buttons, motto }, color }: HeroColumnsProps) {
  return (
    <div className="rounded bg-gray-900">
      <div className="md- grid px-6 py-24 sm:py-24 md:grid-cols-2 md:px-10 lg:items-center lg:justify-between lg:px-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            <PrismicRichText field={headings} />
          </h2>
          {motto && <MottoText {...motto} size="lg" className="mt-[25px]" />}
        </div>
        {buttons && (
          <div className="mt-10 flex items-center justify-center gap-x-5 lg:mt-0 lg:flex-shrink-0">
            {buttons?.map(({ link, type, label }) => (
              <PrismicLink
                field={link}
                className={buttonVariants({ variant: type === 'Outlined' ? 'outline' : 'default', size: 'lg' })}>
                {label}
              </PrismicLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CtaTwoColumn;
