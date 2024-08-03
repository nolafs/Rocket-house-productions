import { render } from '@testing-library/react';

import ContentBlockImage from './content-block-image';

describe('ContentBlockImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContentBlockImage />);
    expect(baseElement).toBeTruthy();
  });
});
