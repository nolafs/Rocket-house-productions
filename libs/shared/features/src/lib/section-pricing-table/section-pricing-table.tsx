import cn from 'classnames';
import { CheckIcon } from 'lucide-react';
import { KeyTextField, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';

interface SectionPricingTableProps {
  tiers: {
    id: string;
    data: {
      uid?: KeyTextField | string | null | undefined;
      name: KeyTextField | string | null | undefined;
      description: RichTextField | null | undefined;
      price: any;
      features: { feature: string }[];
      mostPopular?: boolean;
      link: any;
    };
  }[];
}

export function SectionPricingTable({ tiers }: SectionPricingTableProps) {
  if (tiers.length === 0) {
    return null;
  }

  return (
    <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {tiers.map((tier, idx) => (
        <div
          key={tier.id}
          className={cn(
            tier.data.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
            'rounded-3xl p-8 xl:p-10',
          )}>
          <div className="flex items-center justify-between gap-x-4">
            <h3
              className={cn(
                tier.data.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                'text-lg font-semibold leading-8',
              )}>
              {tier.data.name}
            </h3>
            {tier.data.mostPopular ? (
              <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                Most popular
              </p>
            ) : null}
          </div>
          <div className="mt-4 text-sm leading-6 text-gray-600">
            <PrismicRichText field={tier.data.description} />
          </div>
          <PrismicNextLink
            field={tier.data.link}
            className={cn(
              tier.data.mostPopular
                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
              'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            )}>
            Buy Now
          </PrismicNextLink>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            {tier.data.features.map((item, idx) => (
              <li key={tier.id + 'feature' + idx} className="flex gap-x-3">
                <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                {item.feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SectionPricingTable;
