import { render } from '@testing-library/react';

import LessonComponent from './lessonComponent';

describe('LessonComponent', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LessonComponent />);
    expect(baseElement).toBeTruthy();
  });
});
