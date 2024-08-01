import cn from 'classnames';
import SectionTitle from '../section-title/section-title';
import { KeyTextField, RichTextField } from '@prismicio/client';
import FaqItem from './faq-item';

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
    faqs: any[];
  };

  color?: 'A' | 'B' | 'C';
}

export function SectionFaqs({ data: { headings, text, body, faqs }, color = 'C' }: SectionFagsProps) {
  return (
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
            <FaqItem key={faq.id} heading={faq.data.heading} body={faq.data.body} />
          ))}
        </dl>
      </div>
    </div>
  );
}

export default SectionFaqs;
