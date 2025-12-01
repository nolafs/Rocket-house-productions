'use client';

import { usePurchaseStore } from '@rocket-house-productions/store';
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
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
  const [isProcessing, setIsProcessing] = useState(false);
  const hasProcessed = useRef(false);
  const router = useRouter();

  // Determine if we should show the selection UI
  const shouldShowSelection = useMemo(() => {
    if (isLoading || isValidating || isError || !user) return false;
    if (isProcessing) return false;
    // Show selection if type is explicitly null or if we haven't processed yet
    return type === null || !hasProcessed.current;
  }, [user, isLoading, isValidating, isError, type, isProcessing]);

  // Handle purchase flow in useEffect, but only trigger async operations
  useEffect(() => {
    if (!user || isLoading || isValidating || isError) return;
    if (hasProcessed.current) return;
    if (type === null) return; // Wait for user to select

    hasProcessed.current = true;

    if (type === 'free') {
      const createFreeAccount = async () => {
        setIsProcessing(true);
        try {
          const res = await axios.post('/api/stripe/checkfree', {
            courseId: courseId,
          });

          if (res.data) {
            router.push('/courses/success');
          }
        } catch (error) {
          console.error('Free account creation failed:', error);
          hasProcessed.current = false;
        } finally {
          setIsProcessing(false);
        }
      };

      createFreeAccount();
    }

    if (type === 'payed') {
      if (productId) {
        const payment = async () => {
          setIsProcessing(true);
          try {
            const redirectUrl = await axios.post('/api/stripe/checkurl', {
              productId,
              userId: userId,
              email,
            });
            if (redirectUrl.data?.url) {
              router.push(redirectUrl.data.url);
            }
          } catch (error) {
            console.error('Payment redirect failed:', error);
            hasProcessed.current = false;
          } finally {
            setIsProcessing(false);
          }
        };
        payment();
      }
    }
  }, [user, isLoading, isError, isValidating, productId, courseId, type, userId, email, router]);

  // Handle error redirect
  useEffect(() => {
    if (isError || (!user && !isLoading && !isValidating)) {
      router.push('/');
    }
  }, [isError, user, isLoading, isValidating, router]);

  if (isLoading || isValidating) {
    return (
      <div className={'mt-5 flex h-svh w-full flex-col items-center justify-center'}>
        <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
      </div>
    );
  }

  if (isError || !user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className={'mt-5 flex min-h-svh w-full flex-col items-center justify-center overflow-auto'}>
      {shouldShowSelection ? (
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
  );
}

export default PurchaseOption;
