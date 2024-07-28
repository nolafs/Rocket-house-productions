import { render } from '@testing-library/react';

import NewsletterFormStatus from './newsletter-form-status';

describe('NewsletterFormStatus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NewsletterFormStatus />);
    expect(baseElement).toBeTruthy();
  });
});
