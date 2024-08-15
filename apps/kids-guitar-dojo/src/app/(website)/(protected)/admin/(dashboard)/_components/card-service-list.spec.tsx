import { render } from '@testing-library/react';

import CardServiceList from './card-service-list';

describe('CardServiceList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardServiceList />);
    expect(baseElement).toBeTruthy();
  });
});
