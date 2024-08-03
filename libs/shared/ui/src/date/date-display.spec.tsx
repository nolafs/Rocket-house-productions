import { render } from '@testing-library/react';

import DateDisplay from './date-display';

describe('DateDisplay', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DateDisplay />);
    expect(baseElement).toBeTruthy();
  });
});
