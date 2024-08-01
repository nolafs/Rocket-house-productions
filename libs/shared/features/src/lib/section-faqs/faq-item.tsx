'use client';
import { KeyTextField, RichTextField } from '@prismicio/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@rocket-house-productions/shadcn-ui';
import { useState } from 'react';
import { PrismicRichText } from '@prismicio/react';

interface FaqItemProps {
  heading: KeyTextField | null | undefined;
  body: RichTextField | null | undefined;
}

export function FaqItem({ heading, body }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger>
        <div className="group flex w-full items-start justify-between text-left">
          <span className="text-base font-semibold leading-7">{heading}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <PrismicRichText field={body} />
      </CollapsibleContent>
    </Collapsible>
  );
}

export default FaqItem;
