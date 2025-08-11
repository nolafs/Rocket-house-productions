import '../../../../styles/lesson.scss';

export const metadata = {
  title: 'Welcome to Kids Guitar Dojo courses',
  description: 'Course pages for you to learn guitar with your kids.',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
