'use client';
import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { usePurchaseStore } from '@rocket-house-productions/store';
import { redirect, useRouter } from 'next/navigation';

interface BuyButtonProps {
  productId?: string | null | undefined;
  type: 'payed' | 'free';
  mostPopular: boolean | undefined;
}

export function BuyButton({ productId, type, mostPopular = false }: BuyButtonProps) {
  const router = useRouter();
  const signupUrl = type === 'free' ? '/sign-up' : `/sign-up?product=${productId}`;
  const { setProductId, setType } = usePurchaseStore();

  const handleBuy = () => {
    setProductId(productId);
    setType(type);
    router.push(signupUrl);
  };

  return (
    <Button
      onClick={handleBuy}
      variant={mostPopular ? 'default' : 'outline'}
      className={cn('mt-6 w-full shadow-sm shadow-black/30')}
      size={'lg'}>
      Start now
    </Button>
  );
}

export default BuyButton;
