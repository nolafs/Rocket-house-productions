'use client';
import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { usePurchaseStore } from '@rocket-house-productions/store';
import { useRouter } from 'next/navigation';

interface BuyButtonProps {
  productId?: string | null | undefined;
  courseId?: string | null | undefined;
  type: 'payed' | 'free' | null;
  mostPopular: boolean | undefined;
}

export function BuyButton({ productId, courseId, type, mostPopular = false }: BuyButtonProps) {
  const router = useRouter();
  const signupUrl = type === 'free' ? '/sign-up?purchase=free' : `/sign-up?product=${productId}`;
  const { setProductId, setCourseId, setType } = usePurchaseStore();

  const handleBuy = () => {
    console.log('[BuyButton]', productId, courseId, type);
    setProductId(productId || null);
    setCourseId(courseId || null);
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
