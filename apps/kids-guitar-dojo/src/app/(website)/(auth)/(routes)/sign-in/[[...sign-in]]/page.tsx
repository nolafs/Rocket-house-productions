import { SignIn } from '@clerk/nextjs';
import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import Image from 'next/image';
import LogoFull from '@assets/logo_full.png';

export default async function Page() {
  const client = createClient();
  const settings = await client.getSingle('settings');

  return (
    <main>
      <div className={'flex h-svh min-h-svh w-full flex-col justify-center md:flex-row'}>
        <div className={'flex w-full flex-col items-center justify-center bg-white md:w-1/2'}>
          <div>
            <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
          </div>
          <SignIn signUpUrl={'/sign-up'} fallbackRedirectUrl="/courses" signUpFallbackRedirectUrl="/" />
        </div>
        <div className={'bg-primary flex flex-col items-center justify-center md:w-1/2'}>
          <PrismicNextImage field={settings.data.sign_in_image} />
        </div>
      </div>
    </main>
  );
}
