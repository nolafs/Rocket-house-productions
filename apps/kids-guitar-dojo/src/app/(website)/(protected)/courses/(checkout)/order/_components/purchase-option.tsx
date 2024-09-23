'use client';

import { usePurchaseStore } from '@rocket-house-productions/store';
import { ReactNode, useEffect, useState } from 'react';
import { Bounded } from '@components/Bounded';
import { Loader2 } from 'lucide-react';
import LogoFull from '@assets/logo_full.png';
import { Button } from '@rocket-house-productions/shadcn-ui';
import Image from 'next/image';
import { useUser } from '@rocket-house-productions/hooks';
import { useRouter, redirect } from 'next/navigation';
import axios from 'axios';

interface PurchaseOptionProps {
  children?: ReactNode;
  userId: string;
  email: string | null | undefined;
}

export function PurchaseOption({ children, userId, email }: PurchaseOptionProps) {
  const { user, isLoading, isError, isValidating } = useUser(userId);
  const { productId, type } = usePurchaseStore();
  const [state, setState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading && !isValidating && !isError) {
      if (type === 'free') {
        setState('ready');
        return;
      }

      if (productId) {
        //payment link to stripe
        const payment = async () => {
          const redirectUrl = await axios.post('/api/stripe/checkurl', {
            productId,
            userId: user.id,
            email,
          });
          if (redirectUrl.data?.url) {
            router.push(redirectUrl.data.url);
          } else {
            setState('ready');
          }
        };
        payment();
        setState(null);
      } else {
        setState('ready');
      }
    }
  }, [user, isLoading, isError, isValidating, productId, type]);

  if (isLoading || isValidating) {
    return (
      <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
        <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
      </div>
    );
  }

  if (isError || !user) {
    router.push('/');
  }
  if (user && !isLoading && !isValidating) {
    return (
      <>
        <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
          {state === 'ready' ? (
            <>
              <div>
                <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
              </div>
              <h1 className={'text-2xl font-bold lg:text-3xl'}>Please select from the following options:</h1>
              {children}
            </>
          ) : (
            <div>
              <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
            </div>
          )}
        </div>
      </>
    );
  } else {
    router.push('/');
  }
  return null;
}

export default PurchaseOption;
