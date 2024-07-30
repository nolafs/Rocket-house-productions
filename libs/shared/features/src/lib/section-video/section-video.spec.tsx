import { render } from '@testing-library/react';

import SectionVideo from './section-video';

describe('SectionVideo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionVideo />);
    expect(baseElement).toBeTruthy();
  });
});
