import { render } from '@testing-library/react';

import CardAccounts from './card-accounts';

describe('CardAccounts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardAccounts />);
    expect(baseElement).toBeTruthy();
  });
});
