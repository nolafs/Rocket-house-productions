import NextTopLoader from 'nextjs-toploader';
import { ClerkProvider } from '@clerk/nextjs';

export default async function Layout({ children }: { children: React.ReactNode }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return <ClerkProvider>{children}</ClerkProvider>;
}
