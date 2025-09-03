import { render } from '@testing-library/react';

import Fretboard from './fretboard';

describe('Fretboard', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Fretboard />);
    expect(baseElement).toBeTruthy();
  });
});
