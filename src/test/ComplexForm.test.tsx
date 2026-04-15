import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComplexForm } from '../pages/ComplexForm';

describe('ComplexForm', () => {
  beforeEach(() => {
    render(<ComplexForm />);
  });

  it('should display Login In button text', () => {
    const submitButton = screen.getByTestId('form-submit');
    expect(submitButton).toHaveTextContent('Login In');
  });
});