export type BlogType = {
  id: string;
  uid: string;
  first_publication_date: string;
  last_publication_date: string;
  data: BlogPostType
}

export type BlogPostType = {
  title: string;
  published_date: string;
  category: string;
  main: any[];
  author: any[];
  feature_image: any;
}
