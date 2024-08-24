import '../../../../styles/lesson.scss';
import NextTopLoader from 'nextjs-toploader';

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo courses',
  description: 'Course pages for you to learn guitar with your kids.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Loading-bar */}
      <NextTopLoader zIndex={500} color={'var(--color-primary)'} height={5} showSpinner={false} shadow={false} />
      {children}
    </>
  );
}
