import { render } from '@testing-library/react';

import QuizNext from './quiz-next';

describe('QuizNext', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuizNext />);
    expect(baseElement).toBeTruthy();
  });
});
