import { render } from '@testing-library/react';

import ModuleColorForm from './module-color-form';

describe('ModuleColorForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ModuleColorForm />);
    expect(baseElement).toBeTruthy();
  });
});
