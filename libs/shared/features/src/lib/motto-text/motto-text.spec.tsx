import { render } from '@testing-library/react';

import MottoText from './motto-text';

describe('MottoText', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MottoText />);
    expect(baseElement).toBeTruthy();
  });
});
