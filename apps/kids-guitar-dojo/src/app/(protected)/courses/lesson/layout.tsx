import '../../../../styles/navbar.scss';
import '../../../global.scss';
import { Raleway } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
});

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo courses',
  description: 'Course pages for you to learn guitar with your kids.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Loading-bar */}
      <NextTopLoader color={'var(--color-primary)'} height={5} showSpinner={false} shadow={false} />
      {children}
    </>
  );
}
