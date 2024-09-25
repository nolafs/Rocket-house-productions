import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui';
import { freeCheckout, stripeCheckoutAction } from '@rocket-house-productions/actions/server';

interface CheckoutButtonProps {
  productId?: string | null | undefined;
  courseId?: string | null | undefined;
  purchaseId?: string | null | undefined;
  type: 'payed' | 'free';
  mostPopular: boolean | undefined;
  sales?: boolean | undefined;
}

export function CheckoutButton({
  productId,
  type,
  courseId,
  purchaseId,
  mostPopular = false,
  sales = false,
}: CheckoutButtonProps) {
  if (type === 'free') {
    if (!courseId) {
      console.error('Course id is required for free course');
      return null;
    }

    return (
      <form action={freeCheckout}>
        <input hidden={true} id="courseId" name="courseId" value={courseId} readOnly={true} />
        <Button
          type={'submit'}
          variant={mostPopular ? 'default' : 'outline'}
          className={cn('mt-6 w-full shadow-sm shadow-black/30')}
          size={'lg'}>
          Start now
        </Button>
      </form>
    );
  } else {
    if (!productId) {
      console.error('Product id is required for paid course');
      return null;
    }
    return (
      <form action={stripeCheckoutAction}>
        <input hidden={true} id="productId" name="productId" value={productId} readOnly={true} />
        {purchaseId && <input hidden={true} id="purchaseId" name="purchaseId" value={purchaseId} readOnly={true} />}
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
}

export default CheckoutButton;
