import { render } from '@testing-library/react';

import NavLogin from './nav-login';

describe('NavLogin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavLogin />);
    expect(baseElement).toBeTruthy();
  });
});
