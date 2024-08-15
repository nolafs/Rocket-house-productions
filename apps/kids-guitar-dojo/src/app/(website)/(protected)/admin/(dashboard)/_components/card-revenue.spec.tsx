import { render } from '@testing-library/react';

import CardRevenue from './card-revenue';

describe('CardRevenue', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardRevenue />);
    expect(baseElement).toBeTruthy();
  });
});
