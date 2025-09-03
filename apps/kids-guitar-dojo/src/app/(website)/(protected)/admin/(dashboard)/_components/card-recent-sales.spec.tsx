import { render } from '@testing-library/react';

import CardRecentSales from './card-recent-sales';

describe('CardRecentSales', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardRecentSales />);
    expect(baseElement).toBeTruthy();
  });
});
