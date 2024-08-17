import { render } from '@testing-library/react';

import VideoLibraryList from './video-library-list';

describe('VideoLibraryList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VideoLibraryList />);
    expect(baseElement).toBeTruthy();
  });
});
