'use client';
import { usePurchaseStore } from '@rocket-house-productions/store';
import { ReactNode, useEffect, useState } from 'react';
import { Bounded } from '@components/Bounded';
import { Loader2 } from 'lucide-react';
import LogoFull from '@assets/logo_full.png';
import { Button } from '@rocket-house-productions/shadcn-ui';
import Image from 'next/image';
import { checkoutUrl } from '@rocket-house-productions/actions/server';

interface PurchaseOptionProps {
  children?: ReactNode;
  userId: string;
  email: string | null | undefined;
}

export function PurchaseOption({ children, userId, email }: PurchaseOptionProps) {
  const { productId, type, setProductId, setType } = usePurchaseStore();
  const [state, setState] = useState<string | null>(null);

  useEffect(() => {
    console.log('productId', productId);
    //if product id go to stripe payment
    if (productId) {
      console.log('productId', productId);
      //payment link to stripe
      const payment = async () => {
        await checkoutUrl(productId, userId, email || '');
      };

      payment();
      setState(null);
    } else {
      setState('ready');
    }

    return () => {
      setProductId(null);
      setState(null);
    };
  }, [productId, type]);

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
            <Bounded as={'section'} yPadding={'sm'} className={'w-full max-w-3xl px-5'}>
              <div className="w-full rounded-md bg-gray-200">
                <div className="grid px-6 py-16 sm:py-5 md:grid-cols-2 md:px-7 lg:items-center lg:justify-between lg:px-8">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-500">
                      Not sure yet, you like to test drive it?
                    </h2>
                  </div>

                  <div className="mt-10 flex items-center justify-end gap-x-5 lg:mt-0 lg:flex-shrink-0">
                    <Button variant={'default'} size={'sm'}>
                      Free Trial
                    </Button>
                  </div>
                </div>
              </div>
            </Bounded>
          </>
        ) : (
          <div>
            <Loader2 className={'text-primary h-12 w-12 animate-spin'} />
          </div>
        )}
      </div>
    </>
  );
}

export default PurchaseOption;
