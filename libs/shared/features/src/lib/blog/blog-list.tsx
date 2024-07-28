import { BlogCard } from '@rocket-house-productions/ui';
import { PrismicLink } from '@prismicio/react';

interface BlogListProps {
  posts: any[] | undefined | null;
}

export function BlogList({ posts }: BlogListProps) {
  if (!posts?.length) {
    return <div>No posts found</div>;
  }

  return (
    <div className={'container mx-auto mb-20'}>
      <div className={'grid grid-cols-1 grid-cols-3 md:gap-7 lg:gap-10'}>
        {posts.map(post => (
          <PrismicLink document={post} key={post.id} className={'group'}>
            <BlogCard {...post.data} />
          </PrismicLink>
        ))}
      </div>
    </div>
  );
}

export default BlogList;
