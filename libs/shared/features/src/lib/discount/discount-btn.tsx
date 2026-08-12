import { KeyTextField } from '@prismicio/client';

interface DiscountBtnProps {
  discountCode?: KeyTextField;
}

export function DiscountBtn({ discountCode }: DiscountBtnProps) {
  return <div className={'bg-primary text-4xl'}>{discountCode}</div>;
}

export default DiscountBtn;
