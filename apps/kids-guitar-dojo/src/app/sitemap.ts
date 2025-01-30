import { MetadataRoute } from 'next';
import { createClient } from '@/prismicio';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = createClient();

  const posts = await client
    .getByType('blog_post', {
      pageSize: 100,
      page: 0,
      orderings: [
        {
          field: 'my.posts.published_date',
          direction: 'desc',
        },
      ],
    })
    .then(response => {
      return response.results;
    })
    .catch(() => []);

  const blogPosts = posts.map(post => {
    return {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.uid}`,
      lastModified: post.data.publishing_date?.toString() ?? new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    };
  });

  return [
    {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/the-course`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/our-story`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    ...blogPosts,
  ] as MetadataRoute.Sitemap;
}
