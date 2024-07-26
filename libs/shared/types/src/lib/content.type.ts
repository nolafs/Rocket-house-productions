import {RichTextField} from '@prismicio/client';

export interface SectionTitleType {
  title: RichTextField | null | undefined;
  subtitle?: string | null | undefined;
}

export interface MottoType {
  text: RichTextField | null | undefined;
  path?: string | null | undefined;
  pathText?: string | null | undefined;
}
