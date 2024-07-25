'use client';
import SocialIcons from './social-icons';
import cn from 'classnames';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {LinkPrismicType, SocialLinkItemType} from '@rocket-house-productions/types';
import {Button} from '@rocket-house-productions/ui';


interface SocialLinkProps {
  item: SocialLinkItemType;
  className?: string;
  iconsClass?: string;
  icons?: boolean;
}

export const SocialLink = ({ item, className, icons, iconsClass }: SocialLinkProps) => {

  const openSocialMediaLink = (link: LinkPrismicType) => {

    if(!link?.url){
      return;
    }

    const userAgent = navigator.userAgent || navigator.vendor;
    let appUrl: any = link.url; // Default to the provided URL as a fallback.

    if (/iPad|iPhone|iPod|android/i.test(userAgent)) {
      // Detect the platform based on the URL
      if (link.url.includes('twitter.com')) {
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          appUrl = link.url.replace(
            'https://twitter.com',
            'twitter://user?screen_name'
          );
        } else if (/android/i.test(userAgent)) {
          appUrl = link.url.replace(
            'https://twitter.com',
            'twitter://user?screen_name'
          );
        }
      } else if (link.url.includes('facebook.com')) {
        // Extract page id or username from the URL for Facebook as needed
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          appUrl = 'fb://facewebmodal/f?href=' + link.url;
        } else if (/android/i.test(userAgent)) {
          appUrl = 'fb://facewebmodal/f?href=' + link.url;
        }
      } else if (link.url.includes('tiktok.com')) {
        /* TODO: Implement TikTok deep linking
        // TikTok's scheme may vary and often requires specific paths; adjust as needed
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          // This is an example and may not directly open the app depending on the URL structure
          appUrl = url.replace("https://www.tiktok.com", "snssdk1233://");
        } else if (/android/i.test(userAgent)) {
          appUrl = url.replace("https://www.tiktok.com", "snssdk1233://");
        }

         */
      } else if (link.url.includes('instagram.com')) {
        if (/iPad|iPhone|iPod/.test(userAgent)) {
          appUrl = link.url.replace(
            'https://www.instagram.com',
            'instagram://user?username'
          );
        } else if (/android/i.test(userAgent)) {
          appUrl = link.url.replace(
            'https://www.instagram.com',
            'instagram://user?username'
          );
        }
      }
    }

    // Attempt to open the app-specific URL
    window.location = appUrl;
  };

  console.log('links', item)

  if (icons) {
    return (
      <button
        className={cn(className, 'w-5 h-5 text-gray-400 hover:text-primary')}
        onClick={() => openSocialMediaLink(item?.url)}
        rel="noopener noreferrer"
      >
        <SocialIcons type={item?.type} url={item?.url} props={iconsClass} />
      </button>
    );
  } else {
    return (<Button
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
