import cn from 'classnames';
import { CheckIcon } from 'lucide-react';

interface SectionPricingTableProps {
  tiers: {
    id: string;
    name: string;
    description: string;
    price: {
      monthly: string;
      yearly: string;
    };
    features: string[];
    mostPopular?: boolean;
    link: string;
  }[];
}

export function SectionPricingTable({ tiers }: SectionPricingTableProps) {
  return (
    <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {tiers.map(tier => (
        <div
          key={tier.id}
          className={cn(
            tier.mostPopular ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-200',
            'rounded-3xl p-8 xl:p-10',
          )}>
          <div className="flex items-center justify-between gap-x-4">
            <h3
              id={tier.id}
              className={cn(tier.mostPopular ? 'text-indigo-600' : 'text-gray-900', 'text-lg font-semibold leading-8')}>
              {tier.name}
            </h3>
            {tier.mostPopular ? (
              <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                Most popular
              </p>
            ) : null}
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
          <a
            href={tier.link}
            aria-describedby={tier.id}
            className={cn(
              tier.mostPopular
                ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
              'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
            )}>
            Buy plan
          </a>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            {tier.features.map(feature => (
              <li key={feature} className="flex gap-x-3">
                <CheckIcon aria-hidden="true" className="h-6 w-5 flex-none text-indigo-600" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default SectionPricingTable;
