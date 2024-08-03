import { render } from '@testing-library/react';

import FaqItem from './faq-item';

describe('FaqItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FaqItem />);
    expect(baseElement).toBeTruthy();
  });
});
