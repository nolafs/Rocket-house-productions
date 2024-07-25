
import {BlogList, Breadcrumb} from '@rocket-house-productions/features';
import {createClient} from '@/prismicio';
import {HeaderSimple} from '@rocket-house-productions/layout';

export default async function Page() {

  const client = createClient();
  const pages = await client.getAllByType("blog_post");

  console.log(pages)

  if(!pages) {
    return <div>Loading...</div>
  }

  return (
    <main>
      {/* Header */}
      <HeaderSimple header={'Blog'} />
      <Breadcrumb
        pages={[{path: "/", label: "home"}]}
        currentPage="Blog"
      />
      {/* Blog Post */}
      <BlogList posts={pages}/>
    </main>
  );
}
