import { render } from '@testing-library/react';

import PurchaseOption from './purchase-option';

describe('PurchaseOption', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PurchaseOption />);
    expect(baseElement).toBeTruthy();
  });
});
