import { NavbarSimple } from '@rocket-house-productions/layout';
import { auth } from '@clerk/nextjs/server';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = auth();

  return (
    <>
      <NavbarSimple isAdmin={sessionClaims?.metadata?.role === 'admin'} />
      {children}
    </>
  );
}
