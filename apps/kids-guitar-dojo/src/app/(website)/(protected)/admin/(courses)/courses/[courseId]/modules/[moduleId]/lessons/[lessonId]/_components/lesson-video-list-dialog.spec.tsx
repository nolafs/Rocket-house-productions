import { render } from '@testing-library/react';

import LessonVideoListDialog from './lesson-video-list-dialog';

describe('LessonVideoListDialog', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LessonVideoListDialog />);
    expect(baseElement).toBeTruthy();
  });
});
