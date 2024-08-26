import { render } from '@testing-library/react';

import CardTotalLessonCompleted from './card-total-lesson-completed';

describe('CardTotalLessonCompleted', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CardTotalLessonCompleted />);
    expect(baseElement).toBeTruthy();
  });
});
