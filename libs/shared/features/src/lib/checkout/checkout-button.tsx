import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { stripeCheckoutAction } from '@rocket-house-productions/integration';

interface BuyButtonProps {
  productId?: string | null | undefined;
  courseId?: string | null | undefined;
  type: 'payed' | 'free';
  mostPopular: boolean | undefined;
  sales?: boolean | undefined;
}

export function CheckoutButton({ productId, type, courseId, mostPopular = false, sales = false }: BuyButtonProps) {
  if (type === 'free') {
    if (!courseId) {
      console.error('Course id is required for free course');
      return null;
    }

    return (
      <form action={stripeCheckoutAction}>
        <input hidden={true} id="couseId" name="couseId" value={courseId} />
      </form>
    );
  }

  if (!productId) {
    console.error('Product id is required for paid course');
    return null;
  }
  return (
    <form action={stripeCheckoutAction}>
      <input hidden={true} id="productId" name="productId" value={productId} />
      <Button
        type={'submit'}
        variant={mostPopular ? 'default' : 'outline'}
        className={cn('mt-6 w-full shadow-sm shadow-black/30')}
        size={'lg'}>
        Start now
      </Button>
    </form>
  );
}

export default CheckoutButton;
