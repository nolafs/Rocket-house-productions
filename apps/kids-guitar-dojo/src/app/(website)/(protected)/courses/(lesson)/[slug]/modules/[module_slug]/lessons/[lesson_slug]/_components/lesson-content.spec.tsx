import { render } from '@testing-library/react';

import LessonContent from './lesson-content';

describe('LessonContent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LessonContent />);
    expect(baseElement).toBeTruthy();
  });
});
