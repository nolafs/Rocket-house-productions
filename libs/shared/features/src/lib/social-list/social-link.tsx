'use client';
import SocialIcons from './social-icons';
import cn from 'classnames';

import { LinkPrismicType, SocialLinkItemType } from '@rocket-house-productions/types';
import { Button } from '@rocket-house-productions/ui';

interface SocialLinkProps {
  item: SocialLinkItemType;
  className?: string;
  iconsClass?: string;
  icons?: boolean;
}

export const SocialLink = ({ item, className, icons, iconsClass }: SocialLinkProps) => {
  const openSocialMediaLink = (link: LinkPrismicType) => {
    if (!link?.url) {
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor;
    let appUrl: any = link.url; // Default to the provided URL as a fallback.

    if (/iPad|iPhone|iPod|android/i.test(userAgent)) {
      // Detect the platform based on the URL
      if (link.url.includes('twitter.com')) {
        const match = link.url.match(/twitter\.com\/([^/]+)/);
        if (match && match[1]) {
          const username = match[1];
          if (/iPad|iPhone|iPod/.test(userAgent)) {
            appUrl = `twitter://user?screen_name=${username}`;
          } else if (/android/i.test(userAgent)) {
            appUrl = `twitter://user?screen_name=${username}`;
          }
        }
      } else if (link.url.includes('facebook.com')) {
        // Assuming URL has the format 'https://www.facebook.com/page_id' or similar
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          appUrl = `fb://facewebmodal/f?href=${link.url}`;
        } else if (/android/i.test(userAgent)) {
          appUrl = `fb://facewebmodal/f?href=${link.url}`;
        }
      } else if (link.url.includes('tiktok.com')) {
        // Example: extract the username from 'https://www.tiktok.com/@username'
        const match = link.url.match(/tiktok\.com\/@([^/]+)/);
        if (match && match[1]) {
          const username = match[1];
          if (/iPad|iPhone|iPod/.test(userAgent)) {
            appUrl = `snssdk1233://user?username=${username}`;
          } else if (/android/i.test(userAgent)) {
            appUrl = `snssdk1233://user?username=${username}`;
          }
        }
      } else if (link.url.includes('instagram.com')) {
        const match = link.url.match(/instagram\.com\/([^/]+)/);
        if (match && match[1]) {
          const username = match[1];
          if (/iPad|iPhone|iPod/.test(userAgent)) {
            appUrl = `instagram://user?username=${username}`;
          } else if (/android/i.test(userAgent)) {
            appUrl = `instagram://user?username=${username}`;
          }
        }
      }
    }

    // Attempt to open the app-specific URL
    window.location = appUrl;
  };

  if (icons) {
    return (
      <button
        className={cn(className, 'hover:text-primary h-5 w-5 text-gray-400')}
        onClick={() => openSocialMediaLink(item?.url)}
        rel="noopener noreferrer">
        <SocialIcons type={item?.type} url={item?.url} props={iconsClass} />
      </button>
    );
  } else {
    return (
      <Button
        onClick={() => openSocialMediaLink(item?.url)}
        hasIcon={false}
        size={'lg'}
        label={item?.name}
        classNames={className}
      />
    );
  }
};

export default SocialLink;
