import { render } from '@testing-library/react';

import HeroCenter from './hero-center';

describe('HeroCenter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeroCenter />);
    expect(baseElement).toBeTruthy();
  });
});
