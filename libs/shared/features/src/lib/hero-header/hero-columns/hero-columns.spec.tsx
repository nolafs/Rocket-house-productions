import { render } from '@testing-library/react';

import HeroColumns from './hero-columns';

describe('HeroColumns', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HeroColumns />);
    expect(baseElement).toBeTruthy();
  });
});
