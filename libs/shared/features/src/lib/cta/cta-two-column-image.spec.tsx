import { render } from '@testing-library/react';

import CtaTwoColumnImage from './cta-two-column-image';

describe('CtaTwoColumnImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CtaTwoColumnImage />);
    expect(baseElement).toBeTruthy();
  });
});
