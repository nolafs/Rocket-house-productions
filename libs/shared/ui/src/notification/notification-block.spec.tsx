import { render } from '@testing-library/react';

import NotificationBlock from './notification-block';

describe('NotificationBlock', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotificationBlock />);
    expect(baseElement).toBeTruthy();
  });
});
