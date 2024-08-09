'use client';
import { BlogCard } from '@rocket-house-productions/ui';
import { PrismicLink } from '@prismicio/react';
import { motion } from 'framer-motion';
import { scrollUpVariants } from '@rocket-house-productions/util';

interface BlogListProps {
  posts: any[] | undefined | null;
}

export function BlogList({ posts }: BlogListProps) {
  if (!posts?.length) {
    return <div>No posts found</div>;
  }

  return (
    <motion.div
      className="container z-10 mx-auto mb-20 px-5"
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.1 }}
      variants={scrollUpVariants}>
      <div className={'grid grid-cols-1 md:grid-cols-2 md:gap-7 lg:grid-cols-3 lg:gap-10'}>
        {posts.map(post => (
          <PrismicLink document={post} key={post.id} className={'group'}>
            <BlogCard
              {...post.data}
              first_publication_date={post.first_publication_date || post.data.publishing_date}
            />
          </PrismicLink>
        ))}
      </div>
    </motion.div>
  );
}

export default BlogList;
