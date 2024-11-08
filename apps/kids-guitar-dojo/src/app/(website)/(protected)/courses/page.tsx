import { auth } from '@clerk/nextjs/server';
import { Loader2 } from 'lucide-react';

export default async function Page({ params }: { params: { product: string[] } }) {
  const { userId, sessionClaims } = auth();

  console.log('[COURSE]', sessionClaims);

  return (
    <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
      <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
    </div>
  );
}
