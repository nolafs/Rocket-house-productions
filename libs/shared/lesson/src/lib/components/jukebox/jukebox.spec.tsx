import { render } from '@testing-library/react';

import Jukebox from './jukebox';

describe('Jukebox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Jukebox />);
    expect(baseElement).toBeTruthy();
  });
});
