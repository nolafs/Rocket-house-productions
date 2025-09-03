import { render } from '@testing-library/react';

import SectionBlog from './section-blog';

describe('SectionBlog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SectionBlog />);
    expect(baseElement).toBeTruthy();
  });
});
