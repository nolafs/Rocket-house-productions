import {link} from './link.prismic.type';

export type SocialLinkItemType = {
  type?: 'facebook' | 'instagram' | 'twitter' | 'gitHub' | 'youtube' | 'tiktok' | string | undefined | null;
  name?: string | undefined | null;
  url?: link | string | undefined | null;
};
