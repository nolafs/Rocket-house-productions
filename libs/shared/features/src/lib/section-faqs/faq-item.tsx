'use client';
import { KeyTextField, RichTextField } from '@prismicio/client';
import { Button, Collapsible, CollapsibleContent, CollapsibleTrigger } from '@rocket-house-productions/shadcn-ui';
import { useState } from 'react';
import { PrismicRichText } from '@prismicio/react';
import { CircleArrowDownIcon, CircleArrowUpIcon } from 'lucide-react';

interface FaqItemProps {
  heading: KeyTextField | null | undefined;
  body: RichTextField | null | undefined;
}

export function FaqItem({ heading, body }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <dt>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="lg" className={'w-full'}>
            <div className="flex w-full items-start justify-between text-left">
              <span className="sr-only">Toggle</span>
              <span className="font-semibold leading-7">{heading}</span>
              <span>{isOpen ? <CircleArrowUpIcon size={24} /> : <CircleArrowDownIcon size={24} />}</span>
            </div>
          </Button>
        </CollapsibleTrigger>
      </dt>

      <CollapsibleContent>
        <dd className="mt-5 px-8">
          <PrismicRichText field={body} />
        </dd>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default FaqItem;
