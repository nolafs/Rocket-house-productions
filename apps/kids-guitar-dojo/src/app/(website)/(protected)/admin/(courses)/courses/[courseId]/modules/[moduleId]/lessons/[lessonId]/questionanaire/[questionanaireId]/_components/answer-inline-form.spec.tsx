import { render } from '@testing-library/react';

import AnswerInlineForm from './answer-inline-form';

describe('AnswerInlineForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AnswerInlineForm />);
    expect(baseElement).toBeTruthy();
  });
});
