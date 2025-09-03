import { render } from '@testing-library/react';

import CardEnrollment from './card-enrollment';

describe('CardEnrollment', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardEnrollment />);
    expect(baseElement).toBeTruthy();
  });
});
