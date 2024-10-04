import { RedirectToSignUp, SignUp } from '@clerk/nextjs';
import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';
import { PrismicNextImage } from '@prismicio/next';
import { createClient } from '@/prismicio';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { product: string[] } }) {
  const client = createClient();
  const settings = await client.getSingle('settings');

  const { userId } = auth();

  if (userId) {
    redirect('/courses');
  }

  return (
    <main>
      <div className={'flex h-svh min-h-svh w-full flex-col justify-center md:flex-row'}>
        <div className={'bg-primary hidden flex-col items-center justify-center md:flex md:w-1/2'}>
          <PrismicNextImage field={settings.data.sign_up_image} />
        </div>
        <div className={'flex w-full flex-col items-center justify-center bg-white md:w-1/2'}>
          <div>
            <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
          </div>
          <SignUp
            signInUrl={'/sign-in'}
            signInFallbackRedirectUrl={'/courses/order'}
            forceRedirectUrl={'/courses/order'}
          />
        </div>
      </div>
    </main>
  );
}
