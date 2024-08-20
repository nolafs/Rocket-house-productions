import { render } from '@testing-library/react';

import LessonNext from './lesson-next';

describe('LessonNext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LessonNext />);
    expect(baseElement).toBeTruthy();
  });
});
