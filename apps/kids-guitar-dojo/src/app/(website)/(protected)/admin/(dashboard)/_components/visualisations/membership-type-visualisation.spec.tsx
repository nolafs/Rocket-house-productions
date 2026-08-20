import { render } from '@testing-library/react';

import MembershipTypeVisualisation from './membership-type-visualisation';

describe('MembershipTypeVisualisation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<MembershipTypeVisualisation />);
    expect(baseElement).toBeTruthy();
  });
});
