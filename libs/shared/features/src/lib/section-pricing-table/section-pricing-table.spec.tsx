import { render } from '@testing-library/react';

import SectionPricingTable from './section-pricing-table';

describe('SectionPricingTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionPricingTable />);
    expect(baseElement).toBeTruthy();
  });
});
