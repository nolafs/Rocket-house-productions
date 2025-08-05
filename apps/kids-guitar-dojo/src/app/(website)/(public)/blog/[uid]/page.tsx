import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismicRichText, SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import { HeaderSimple } from '@rocket-house-productions/layout';
import { PrismicNextImage } from '@prismicio/next';
import { BackButton, DateDisplay } from '@rocket-house-productions/ui';
import { BlogList, SharePage } from '@rocket-house-productions/features';
import { Share2Icon } from 'lucide-react';
import { ImageFieldImage } from '@prismicio/types';
import * as prismic from '@prismicio/client';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';
import { WithContext, BlogPosting } from 'schema-dts';
import { BlogCategoryDocumentData } from '../../../../../../prismicio-types';
type Params = { uid: string };

export async function generateMetadata(props: { params: Promise<Params> }, parent: Metadata): Promise<Metadata> {
  const params = await props.params;
  const client = createClient();
  const post = await client
    .getByUID('blog_post', params.uid, {
      fetchLinks: ['author.name', 'blog_category.category'],
    })
    .catch(() => notFound());

  if (post.data?.feature_image?.url) {
    post.data.feature_image.url = `${post.data.feature_image.url}?w=1200&h=630&fit=crop&auto=format,compress`;
  }

  const author = (post.data.author as ContentRelationshipField<Author>).data as AuthorData;

  // Extract tags if available
  const tags = post.data.tags.map(item => {
    const tag = item && 'tag' in item && (item.tag as { data: { name: string } }).data?.name;
    return tag ?? '';
  });

  // Extract manually assigned keywords
  let postKeywords: string[] = [];
  if (post.data.keywords) {
    postKeywords = post.data.keywords.map(item => item.word! ?? '');
  }

  const parentMeta = await parent;
  let parentKeywords: string[] = [];
  if (parentMeta.keywords) {
    parentKeywords = [...parentMeta.keywords];
  }

  // Generate dynamic keywords from title, category, and description
  function generateDynamicKeywords(title: string, category: string, description: string): string[] {
    const extractedKeywords: string[] = [];

    // Extract key terms from title
    if (title) {
      extractedKeywords.push(
        ...title
          .toLowerCase()
          .split(/\s+/)
          .filter(word => word.length > 3),
      );
    }

    // Include category
    if (category) {
      extractedKeywords.push(category.toLowerCase());
    }

    // Extract key terms from description (basic NLP filtering)
    if (description) {
      const descriptionWords = description.toLowerCase().match(/\b\w{4,}\b/g) || [];
      const importantWords = descriptionWords.filter(
        word => !['with', 'that', 'this', 'from', 'your', 'which', 'their', 'have'].includes(word),
      );
      extractedKeywords.push(...importantWords.slice(0, 10)); // Limit to 10 words
    }

    return [...new Set(extractedKeywords)]; // Remove duplicates
  }

  // Get category name
  const category = (post.data.category as ContentRelationshipField<BlogCategoryDocumentData>).data.category ?? '';

  // Generate dynamic keywords
  const dynamicKeywords = generateDynamicKeywords(
    post.data.title ?? '',
    category,
    post.data.meta_description ?? post.data.description ?? '',
  );

  // Finalize keyword list
  let finalKeywords = [...tags, ...postKeywords, ...dynamicKeywords, ...parentKeywords].filter(Boolean); // Remove empty values
  finalKeywords = [...new Set(finalKeywords)]; // Remove duplicates

  finalKeywords = finalKeywords.slice(0, 15); // Limit to 15 keywords

  // Process and trim description
  let description =
    typeof post.data.meta_description === 'string'
      ? post.data.meta_description
      : (post.data.meta_description ?? post.data.description ?? '');

  if (description.length > 160) {
    description = description.substring(0, 157) + '...'; // Keep within 160 chars
  }

  return {
    title: 'Kids Guitar Dojo - ' + post.data.title,
    description: description,
    authors: [{ name: author?.name ?? '' }],
    alternates: {
      canonical: `/blog/${params.uid}`,
    },
    creator: author?.name,
    publisher: author?.name,
    keywords: finalKeywords.length ? finalKeywords.filter((keyword): keyword is string => Boolean(keyword)) : null,
    openGraph: {
      title: post.data.meta_title ?? undefined,
      description: description,
      images: [{ url: post.data.meta_image.url ?? post.data.feature_image.url ?? '' }],
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
  id: string;
}

interface PageData {
  author: ContentRelationshipField<AuthorData>;
  category: ContentRelationshipField<CategoryData>;
}

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const client = createClient();
  const page = await client
    .getByUID('blog_post', params.uid, {
      fetchLinks: ['author.name', 'author.profile_image', 'blog_category.category'],
    })
    .catch(() => notFound());

  const relation = page.data as PageData;

  const author = relation.author.data as AuthorData;
  const category = relation.category.data as CategoryData;

  const categoryId = relation.category.id;

  const relatedPosts = await client.getByType('blog_post', {
    pageSize: 3,
    fetchLinks: ['blog_category.category'],
    filters: [prismic.filter.at('my.blog_post.category', categoryId)],
    orderings: {
      field: 'document.first_publication_date',
      direction: 'desc',
    },
  });

  const jsonLd: WithContext<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: page.data.title || '',
    image: page.data.feature_image?.url || '',
    author: {
      '@type': 'Person',
      name: author?.name || '',
      // The full URL must be provided, including the website's domain.
      url: 'https://kidsguitardojo.com',
    },
    description: page.data.description || '',
    datePublished: page.data.publishing_date || '',
    dateModified: page.data.publishing_date || '',
  };

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
              priority={true}
              imgixParams={{ fm: 'webp', fit: 'crop', crop: ['focalpoint'], width: 1140, height: 600, q: 70 }}
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
                              loading={'lazy'}
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
                {category?.category && (
                  <div className={'flex flex-col space-y-3'}>
                    <div className={'text-sm font-bold text-white'}>Category</div>
                    <div className={'pt-[4px] text-sm font-bold text-white'}>{category?.category}</div>
                  </div>
                )}
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
        <SliceZone slices={page.data.slices} components={components} />
      </article>
      <div className="mx-auto mb-5 w-full max-w-6xl border-t border-gray-100" />
      <div className={'container mx-auto max-w-4xl px-5'}>
        <div className={'flex justify-between space-x-3'}>
          <div>
            <BackButton />
          </div>
          <div className={'flex items-center space-x-3 self-end text-gray-500'}>
            <i>
              <Share2Icon className={'h-6 w-6'} />
            </i>
            <SharePage slug={page.url} title={page.data.title} />
          </div>
        </div>
      </div>
      <div className="mx-auto mt-5 w-full max-w-6xl border-t border-gray-100" />
      <section className={'container mx-auto mt-16'}>
        <h2 className="mb-10 px-5 text-5xl font-extrabold tracking-tight text-gray-900">You May Also Like...</h2>
        <BlogList posts={relatedPosts.results} />
      </section>

      {/* Add JSON-LD to your page */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('blog_post');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
