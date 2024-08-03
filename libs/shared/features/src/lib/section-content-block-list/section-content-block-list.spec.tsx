import { render } from '@testing-library/react';

import SectionContentBlockList from './section-content-block-list';

describe('SectionContentBlockList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionContentBlockList />);
    expect(baseElement).toBeTruthy();
  });
});
