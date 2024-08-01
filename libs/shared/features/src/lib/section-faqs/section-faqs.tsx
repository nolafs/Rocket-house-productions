import cn from 'classnames';
import SectionTitle from '../section-title/section-title';
import { KeyTextField, RichTextField } from '@prismicio/client';

const faqs = [
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  {
    question: 'How do you make holy water?',
    answer:
      'You boil the hell out of it. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.',
  },
  // More questions...
];

interface SectionFagsProps {
  data: {
    headings: RichTextField | null | undefined;
    text?: KeyTextField | null | undefined;
    body: RichTextField | null | undefined;
  };

  color?: 'A' | 'B' | 'C';
}

export function SectionFaqs({ data: { headings, text, body }, color = 'C' }: SectionFagsProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:pt-32 lg:px-8 lg:py-40">
      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <SectionTitle
            title={headings}
            subtitle={text}
            description={body}
            align={'left'}
            titleSize={'large'}
            color={color}
          />
        </div>
        <div className="mt-10 lg:col-span-7 lg:mt-0">
          <dl className="space-y-10">
            {faqs.map(faq => (
              <div key={faq.question}>
                <dt className="text-base font-semibold leading-7 text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default SectionFaqs;
