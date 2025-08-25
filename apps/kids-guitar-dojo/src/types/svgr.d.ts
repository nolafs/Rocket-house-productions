declare module '*.svg' {
  import * as React from 'react';
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  const src: string; // default export remains available if you need the URL
  export default src;
}
