declare const window: any;

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {

  if( typeof window === 'undefined' ) return;

  if(!window?.gtag) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};
