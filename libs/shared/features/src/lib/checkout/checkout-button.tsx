import Checkout from './forms/checkout';
import FreeCheckout from './forms/free-checkout';
import { logger } from '@rocket-house-productions/util';

interface CheckoutButtonProps {
  productId?: string | null | undefined;
  courseId?: string | null | undefined;
  purchaseId?: string | null | undefined;
  type: 'payed' | 'free';
  mostPopular: boolean | undefined;
  sales?: boolean | undefined;
  label?: string | undefined;
}

export function CheckoutButton({
  productId,
  type,
  courseId,
  purchaseId,
  mostPopular = false,
  sales = false,
  label = 'Start now',
}: CheckoutButtonProps) {
  logger.debug('[CheckoutButton]', { productId, type, courseId, purchaseId });

  if (type === 'free') {
    if (!courseId) {
      logger.error('Course id is required for free course');
      return null;
    }

    return (
      <>
        <FreeCheckout courseId={courseId} mostPopular={mostPopular} label={label} />
      </>
    );
  } else {
    if (!productId) {
      logger.error('Product id is required for paid course');
      return null;
    }
    return (
      <>
        <Checkout productId={productId} purchaseId={purchaseId} mostPopular={mostPopular} label={label} />
      </>
    );
  }
}

export default CheckoutButton;
