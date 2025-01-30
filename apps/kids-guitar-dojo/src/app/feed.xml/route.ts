import RSS from 'rss';
import * as prismic from '@prismicio/client';
import config from '../../../slicemachine.config.json';

const repositoryName = process.env.NEXT_PUBLIC_PRISMIC_ENVIRONMENT ?? config.repositoryName;

export async function GET() {
  const client = prismic.createClient(repositoryName);

  const settings = await client.getSingle('settings');

  const posts = await client
    .getByType('blog_post', {
      pageSize: 100,
      page: 0,
      fetchLinks: ['author.name', 'author.profile_image', 'post_category.name'],
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

  const feed = new RSS({
    title: settings.data.meta_title ?? 'Kids Guitar Dojo',
    description: settings.data.meta_description ?? '',
    site_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    feed_url: `https://${process.env.NEXT_PUBLIC_BASE_URL}`,
    copyright: `${new Date().getFullYear()} ${settings.data.copyright_line ?? ''}`,
    language: 'en',
    pubDate: new Date(),
  });

  posts.map(post => {
    feed.item({
      title: post.data.title!,
      guid: `https://${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.uid}`,
      url: `https://${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.uid}`,
      date: post.data.publishing_date!.toString(),
      description: post.data.description ?? '',
      author:
        post.data.author && 'data' in post.data.author
          ? (
              post.data.author.data as {
                name: string;
              }
            ).name
          : 'Kids Guitar Dojo',
      categories:
        post.data.category && 'data' in post.data.category
          ? [
              (
                post.data.category.data as {
                  name: string;
                }
              ).name,
            ]
          : [],
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
}
