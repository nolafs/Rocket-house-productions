import { render } from '@testing-library/react';

import ModuleAwardItem from './module-award-item';

describe('ModuleAwardItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModuleAwardItem />);
    expect(baseElement).toBeTruthy();
  });
});
