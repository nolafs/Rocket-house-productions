import { KeyTextField, RichTextField } from '@prismicio/client';
import SectionTitle from '../section-title/section-title';
import ContentBlockImage from '../content-block-image/content-block-image';

interface SectionContentBlockListProps {
  data: {
    id: string;
    subtitle?: KeyTextField | null | undefined;
    title?: RichTextField | null | undefined;
    items?: {
      image: any;
      optional_image: any;
      subtitle: KeyTextField | string | null;
      title: RichTextField | null | undefined;
      text: RichTextField | null | undefined;
      has_decoration: boolean;
    }[];
  };
}

export function SectionContentBlockList({ data }: SectionContentBlockListProps) {
  return (
    <div>
      {data && <SectionTitle subtitle={data.subtitle} title={data?.title} align="center" titleSize="large" />}
      <div className={'mt-32'}>
        {data.items?.map((item, idx) => (
          <div key={data?.id + idx} className={'max-w-8xl container mx-auto mb-28'}>
            <ContentBlockImage
              data={{
                section_title: {
                  title: item.title,
                  subtitle: item.subtitle,
                },
                motto: {
                  text: item.text,
                },
                images: [
                  {
                    image: item.image,
                    alt: '1: ' + item.title,
                  },
                  {
                    image: item.optional_image,
                    alt: '2: ' + item.title,
                  },
                ],
              }}
              as={'h3'}
              titleSize={'large'}
              alignment={idx % 2 === 0 ? 'Left' : 'Right'}
              hasDecor={item.has_decoration}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SectionContentBlockList;
