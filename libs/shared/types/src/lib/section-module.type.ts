export type SectionModule = {
  id?: string;
  title?: string;
  lessons?: {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
  }[];
};
