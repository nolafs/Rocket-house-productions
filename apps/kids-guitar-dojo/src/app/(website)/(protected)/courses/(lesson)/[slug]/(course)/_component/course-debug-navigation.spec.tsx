import { render } from '@testing-library/react';

import CourseDebugNavigation from './course-debug-navigation';

describe('CourseDebugNavigation', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CourseDebugNavigation />);
    expect(baseElement).toBeTruthy();
  });
});
