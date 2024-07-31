import { render } from '@testing-library/react';

import StarRating from './star-rating';

describe('StarRating', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StarRating />);
    expect(baseElement).toBeTruthy();
  });
});
