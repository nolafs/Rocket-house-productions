import cn from 'classnames';
import { CheckCircleIcon } from 'lucide-react';
import { KeyTextField, RichTextField } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextLink } from '@prismicio/next';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';

interface SectionPricingTableProps {
  tiers: {
    id: string;
    data: {
      uid?: KeyTextField | string | null | undefined;
      name: KeyTextField | string | null | undefined;
      description: RichTextField | null | undefined;
      price: any;
      features: { feature: string }[];
      most_popular?: boolean;
      link: any;
    };
  }[];
}

export function SectionPricingTable({ tiers }: SectionPricingTableProps) {
  if (tiers.length === 0) {
    return null;
  }

  console.log('tiers', tiers);

  return (
    <div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {tiers.map((tier, idx) => (
        <div
          key={tier.id}
          className={cn(
            tier.data.most_popular ? 'ring-primary ring-2' : 'ring-1 ring-gray-200',
            'rounded bg-[#f7f8f9] p-8 xl:p-10',
          )}>
          <div className="flex items-center justify-between gap-x-4">
            <h3
              className={cn(
                tier.data.most_popular ? 'text-primary' : 'text-gray-900',
                'text-2xl font-semibold leading-8',
              )}>
              {tier.data.name}
            </h3>
            {tier.data.most_popular ? (
              <p className="bg-primary rounded-full px-2.5 py-1 text-xs font-semibold leading-5 text-white">
                Most popular
              </p>
            ) : null}
          </div>
          <div className="mt-4 leading-6 text-gray-600">
            <PrismicRichText field={tier.data.description} />
          </div>
          <PrismicNextLink
            field={tier.data.link}
            className={cn(
              buttonVariants({
                variant: tier.data.most_popular ? 'default' : 'outline',
                size: 'lg',
                className: 'mt-6 w-full shadow-sm shadow-black/30',
              }),
            )}>
            Start now
          </PrismicNextLink>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            {tier.data.features.map((item, idx) => (
              <li key={tier.id + 'feature' + idx} className="flex gap-x-3">
                <CheckCircleIcon
                  aria-hidden="true"
                  fill={'rgb(44, 103, 221)'}
                  className="h-6 w-5 flex-none text-white"
                />
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
