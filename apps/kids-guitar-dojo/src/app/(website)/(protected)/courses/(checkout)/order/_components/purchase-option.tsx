'use client';

import { usePurchaseStore } from '@rocket-house-productions/store';
import { ReactNode, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import LogoFull from '@assets/logo_full.png';
import Image from 'next/image';
import { useUser } from '@rocket-house-productions/hooks';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface PurchaseOptionProps {
  children?: ReactNode;
  userId: string;
  email: string | null | undefined;
}

export function PurchaseOption({ children, userId, email }: PurchaseOptionProps) {
  const { user, isLoading, isError, isValidating } = useUser(userId);
  const { productId, courseId, type } = usePurchaseStore();
  const [state, setState] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && !isLoading && !isValidating && !isError) {
      if (type === 'free') {
        const createFreeAccount = async () => {
          const res = await axios.post('/api/stripe/checkfree', {
            courseId: courseId,
          });

          if (res.data) {
            router.push('/courses/success');
          } else {
            setState('ready');
          }
        };

        createFreeAccount();
        setState(null);
      }

      if (type === 'payed') {
        if (productId) {
          //payment link to stripe
          const payment = async () => {
            const redirectUrl = await axios.post('/api/stripe/checkurl', {
              productId,
              userId: userId,
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

      if (type === null) {
        setState('ready');
      }
    }
  }, [user, isLoading, isError, isValidating, productId, courseId, type]);

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
        <div className={'mt-5 flex min-h-svh w-full flex-col items-center justify-center overflow-auto'}>
          {state === 'ready' ? (
            <>
              <div>
                <Image src={LogoFull} alt={'Kids Guitar Dojo'} width={112} height={28} />
              </div>
              <h1 className={'mb-5 px-5 text-center text-2xl font-bold lg:text-3xl'}>
                Please select from the following options:
              </h1>
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
