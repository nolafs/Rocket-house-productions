import cn from 'classnames';
import { Button } from '@rocket-house-productions/shadcn-ui/server';
import { freeCheckout, stripeCheckoutAction } from '@rocket-house-productions/actions/server';
import Checkout from './forms/checkout';
import FreeCheckout from './forms/free-checkout';

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

    return <FreeCheckout courseId={courseId} mostPopular={mostPopular} />;
  } else {
    if (!productId) {
      console.error('Product id is required for paid course');
      return null;
    }
    return <Checkout productId={productId} purchaseId={purchaseId} mostPopular={mostPopular} />;
  }
}

export default CheckoutButton;
