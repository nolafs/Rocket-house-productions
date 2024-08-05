import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismicRichText, SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { HeaderSimple } from '@rocket-house-productions/layout';
import { PrismicNextImage } from '@prismicio/next';
import { DateDisplay } from '@rocket-house-productions/ui';
import { SharePage } from '@rocket-house-productions/features';
import { buttonVariants } from '@rocket-house-productions/shadcn-ui';
import Link from 'next/link';
import { ChevronLeftIcon, Share2Icon } from 'lucide-react';
import { ImageFieldImage } from '@prismicio/types';

type Params = { uid: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const client = createClient();
  const page = await client.getByUID('blog_post', params.uid).catch(() => notFound());

  if (page.data?.feature_image?.url) {
    page.data.feature_image.url = `${page.data.feature_image.url}?w=1200&h=630&fit=crop&auto=format,compress`;
  }

  return {
    title: page.data?.title,
    description: page.data.meta_description || page.data.description,
    openGraph: {
      title: page.data.meta_title ?? undefined,
      images: [{ url: page.data.meta_image.url ?? page.data.feature_image.url ?? '' }],
    },
  };
}

interface AuthorData {
  name: string;
  profile_image: ImageFieldImage;
}

interface CategoryData {
  category: string;
}

interface ContentRelationshipField<T> {
  data: T;
}

interface PageData {
  author: ContentRelationshipField<AuthorData>;
  category: ContentRelationshipField<CategoryData>;
}

export default async function Page({ params }: { params: Params }) {
  const client = createClient();
  const page = await client
    .getByUID('blog_post', params.uid, {
      fetchLinks: ['author.name', 'author.profile_image', 'blog_category.category'],
    })
    .catch(() => notFound());

  const relation = page.data as PageData;

  const author = relation.author.data as AuthorData;
  const category = relation.category.data as CategoryData;

  return (
    <main>
      <article className={'blog-article'}>
        {/* Header */}
        <HeaderSimple
          type={'h1'}
          description={page.data.description}
          header={page.data.title}
          align={'left'}
          size={'large'}
          className={'mb-5 sm:mb-10 md:mb-0'}
        />
        <div className={'px-5'}>
          <div className={'container relative isolate mx-auto mb-10 max-w-4xl overflow-hidden rounded-lg'}>
            <PrismicNextImage
              field={page.data.feature_image}
              width={896}
              height={400}
              imgixParams={{ fm: 'webp', fit: 'crop', crop: ['focalpoint'], width: 1140, height: 600 }}
            />
            <div className={'absolute bottom-5 mx-auto hidden w-full max-w-4xl grid-cols-2 px-8 md:grid'}>
              <div className={'flex space-x-5'}>
                <div className={'flex flex-col space-y-3'}>
                  {/* Author */}
                  {author?.name && (
                    <>
                      <div className={'text-sm font-bold text-white'}>Written by</div>
                      <div className={'flex items-center space-x-3'}>
                        {author.profile_image && (
                          <div>
                            <PrismicNextImage
                              field={author.profile_image}
                              width={32}
                              height={32}
                              className={'h-8 w-8 rounded-full'}
                              imgixParams={{
                                fm: 'webp',
                                fit: 'crop',
                                crop: ['focalpoint'],
                                width: 32,
                                height: 32,
                              }}
                            />
                          </div>
                        )}
                        )<div className={'text-sm font-bold text-white'}>{author?.name}</div>
                      </div>
                    </>
                  )}
                </div>

                <div className={'flex flex-col space-y-3'}>
                  <div className={'mb-[2px] text-sm font-bold text-white'}>Published on</div>
                  <DateDisplay publishDate={page.data.publishing_date} className={'text-white'} />
                </div>
                <div className={'flex flex-col space-y-3'}>
                  <div className={'text-sm font-bold text-white'}>Category</div>
                  <div className={'pt-[4px] text-sm font-bold text-white'}>{category.category}</div>
                </div>
              </div>
              <div className={'self-end'}>
                <SharePage slug={page.url} title={page.data.title} />
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className={'prose prose-sm md:prose-md lg:prose-xl prose-neutral mx-auto mb-20 px-5'}>
          <PrismicRichText field={page.data.main} />
        </div>
      </article>
      <div className={'container mx-auto mb-20 max-w-4xl px-5'}>
        <div className={'flex justify-between space-x-3'}>
          <div>
            <Link href={'/blog'} className={buttonVariants({ variant: 'default', size: 'lg' })}>
              <i>
                <ChevronLeftIcon className={'h-6 w-6'} />
              </i>
              Back <span className={'sr-only'}>to blog</span>
            </Link>
          </div>
          <div className={'flex items-center space-x-3 self-end text-gray-500'}>
            <i>
              <Share2Icon className={'h-6 w-6'} />
            </i>
            <SharePage slug={page.url} title={page.data.title} />
          </div>
        </div>
      </div>
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return pages.map(page => {
    return { uid: page.uid };
  });
}