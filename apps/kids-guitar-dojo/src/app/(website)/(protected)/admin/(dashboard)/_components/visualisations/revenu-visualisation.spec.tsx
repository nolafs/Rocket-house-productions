import { render } from '@testing-library/react';

import RevenuVisualisation from './revenu-visualisation';

describe('RevenuVisualisation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<RevenuVisualisation />);
    expect(baseElement).toBeTruthy();
  });
});
